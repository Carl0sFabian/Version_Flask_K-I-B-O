import pandas as pd
import numpy as np
import re
import nltk
from nltk.tokenize import word_tokenize
from gensim.models import Word2Vec
from sklearn.metrics.pairwise import cosine_similarity
from rank_bm25 import BM25Okapi
import joblib
import ast
import requests
import tensorflow as tf
from keras.models import load_model
import spacy
from functools import lru_cache
import random
import traceback

def normalizar_texto(texto):
    if isinstance(texto, str):
        texto = re.sub(r'[\n\t]', ' ', texto)
        texto = texto.lower()
        texto = re.sub(r'\bq\b', 'que', texto)
        texto = re.sub(r'\btoy\b', 'estoy', texto)
        texto = re.sub(r'\bd\b', 'de', texto)
        texto = re.sub(r'\bpa\b', 'para', texto)
        texto = re.sub(r'\bt\b', 'te', texto)
        texto = texto.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
        texto = re.sub(r'\.$', '', texto)
        texto = texto.replace('"', "'")
        texto = re.sub(r'\s+', ' ', texto).strip()
        return texto
    else:
        return ""

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

def tokenizar_texto(texto):
    if isinstance(texto, str):
        texto = re.sub(r'[^\w\s]', '', texto)
        tokens = word_tokenize(texto, language='spanish')
        return tokens
    else:
        return []

def perdida_coseno(y_true, y_pred):
    y_true = tf.math.l2_normalize(y_true, axis=1)
    y_pred = tf.math.l2_normalize(y_pred, axis=1)
    return 1.0 - tf.reduce_mean(tf.reduce_sum(y_true*y_pred, axis=1))

print("\n--- [INICIANDO SERVIDOR DE CONOCIMIENTO] ---")
print("Cargando modelos de IA... (Esto puede tardar un momento)")

MODELOS_CARGADOS = False
clf_intenciones = None
nlp_es = None
embeddings_preguntas = None
embeddings_respuestas = None
textos_respuestas = []
bm25 = None
modelo_encoder = None
modelo_w2v = None
DIM_EMBEDDING = 100
LONG_MAX = 16
df = None

try:
    df = pd.read_csv('datos_procesados.csv')
    df['pregunta_tokenizada'] = df['pregunta_tokenizada'].apply(ast.literal_eval)
    df['respuesta_tokenizada'] = df['respuesta_tokenizada'].apply(ast.literal_eval)
    df['pregunta'] = df['pregunta'].apply(normalizar_texto) # Asegura que la columna 'pregunta' esté normalizada
    print("Paso 1/6: DataFrame cargado y preguntas normalizadas.")

    modelo_w2v = Word2Vec.load("model.w2v")
    DIM_EMBEDDING = modelo_w2v.vector_size
    print("Paso 2/6: Modelo Word2Vec cargado.")

    modelo_encoder = load_model("lstm_encoder_model.keras", custom_objects={'cosine_loss': perdida_coseno})
    print("Paso 3/6: Modelo LSTM cargado.")

    clf_intenciones = joblib.load("intent_classifier.joblib")
    print("Paso 4/6: Clasificador de intenciones cargado.")

    try:
        nlp_es = spacy.load("es_core_news_md")
        print("Paso 5/6: Modelo spaCy (es_core_news_md) cargado.")
    except IOError:
        print("!! ERROR: Modelo 'es_core_news_md' de spaCy no encontrado.")
        print("!! Ejecuta: python -m spacy download es_core_news_md")
        nlp_es = None

    if not df.empty and 'pregunta_tokenizada' in df.columns:
        LONG_MAX = int(np.percentile(df['pregunta_tokenizada'].apply(len), 95))
        LONG_MAX = max(16, min(LONG_MAX, 200))
    else:
         print("!! ADVERTENCIA: No se pudo calcular LONG_MAX, usando valor por defecto.")

    def tokens_a_vectores(tokens, dim_emb=DIM_EMBEDDING):
        if not tokens or modelo_w2v is None: return np.zeros((0, dim_emb), np.float32)
        return np.asarray([modelo_w2v.wv[t] if t in modelo_w2v.wv else np.zeros(dim_emb, np.float32)
                           for t in tokens], dtype=np.float32)

    def media_oracion(tokens):
        M = tokens_a_vectores(tokens)
        if M.size == 0: return np.zeros((DIM_EMBEDDING,), np.float32)
        mascara = ~(M==0).all(axis=1)
        return M[mascara].mean(axis=0).astype(np.float32) if mascara.any() else np.zeros((DIM_EMBEDDING,), np.float32)

    def rellenar_vectores(matriz, long_max=LONG_MAX, dim_emb=DIM_EMBEDDING):
        salida = np.zeros((long_max, dim_emb), np.float32)
        L = min(long_max, len(matriz))
        if L>0: salida[:L] = matriz[:L]
        return salida

    if not df.empty and 'pregunta_tokenizada' in df.columns and 'respuesta_tokenizada' in df.columns:
        embeddings_preguntas = np.stack([media_oracion(t) for t in df['pregunta_tokenizada']])
        embeddings_respuestas   = np.stack([media_oracion(t) for t in df['respuesta_tokenizada']])
        textos_respuestas = df['respuesta'].tolist()
        corpus_tokens_preguntas = df['pregunta_tokenizada'].tolist()
        bm25 = BM25Okapi(corpus_tokens_preguntas)
        print("Paso 6/6: Índices de búsqueda (BM25, Embeddings) reconstruidos.")
        MODELOS_CARGADOS = True
    else:
        print("!! ERROR: DataFrame vacío o columnas faltantes para crear embeddings/BM25.")

    if MODELOS_CARGADOS:
         print("--- [SISTEMA DE IA LISTO] ---")

except FileNotFoundError as e:
    print(f"\n--- [ERROR FATAL AL CARGAR ARCHIVO] ---")
    print(f"Error: No se encontró el archivo {e.filename}.")
    print("Por favor, ejecuta 'python entrenar_modelos.py' primero y asegúrate que los archivos .csv, .w2v, .keras, .joblib estén en la carpeta correcta.")
except Exception as e:
    print(f"\n--- [ERROR FATAL AL CARGAR MODELOS] ---")
    print(f"Error: {e}")
    traceback.print_exc()
    MODELOS_CARGADOS = False
    clf_intenciones = None
    nlp_es = None
    df = None 

def clasificar_intencion(msg: str, umbral=0.55):
    if not MODELOS_CARGADOS or clf_intenciones is None:
        return (None, 0.0)

    msg_norm = normalizar_texto(msg)
    try:
        proba = clf_intenciones.predict_proba([msg_norm])[0]
        etiquetas = clf_intenciones.classes_
        i = int(np.argmax(proba))
        return (etiquetas[i], float(proba[i])) if proba[i] >= umbral else (None, float(proba[i]))
    except Exception as e:
        print(f"!! ERROR durante la clasificación de intención: {e}")
        return (None, 0.0)

def responder_por_intencion(intencion, msg):
    if intencion == "saludo":
        return random.choice([
            "¡Hola! ¿En qué puedo ayudarte hoy?",
            "¡Buenas! ¿Cómo estás?",
            "¡Hola! Es un gusto saludarte."
        ])
    if intencion == "pedir_objeto":
        return random.choice([
            "Soy un bot, así que no puedo darte objetos físicos, ¡pero puedo ayudarte con información!",
            "Lo siento, mis manos son digitales. No puedo pasarte eso."
        ])
    if intencion == "expresar_emocion":
        msg_norm = normalizar_texto(msg)
        if "feliz" in msg_norm or "contento" in msg_norm or "genial" in msg_norm:
            return "¡Me alegra mucho oír eso! 😄"
        elif "triste" in msg_norm or "enojado" in msg_norm or "mal" in msg_norm:
            return "Oh, lamento que te sientas así. 😕"
        else:
            return "Entiendo cómo te sientes."

    if intencion == "contraseña":  return "Usa 'Olvidé mi contraseña' y revisa spam. Si no llega, dime qué portal es."
    if intencion == "inscripcion": return "Para inscribirte, dime si es curso/plataforma/programa y te paso requisitos."
    if intencion == "pagos":       return "¿Buscas cuotas, medios aceptados o descuentos? Te guío."
    if intencion == "horarios":    return "Atendemos lun-vie 9:00–18:00 (hora local)."
    if intencion == "contacto":    return "Escríbenos a soporte@ejemplo.com o llama al +51 123 456 789."

    return None

def responder_hibrido_bm25(mensaje, alfa=0.7, k_bm25=30, k_final=5, umbral_qa=0.50):
    if not MODELOS_CARGADOS:
        return "Error: Los modelos de IA no pudieron cargarse. Revisa la consola del servidor."

    msg_norm = normalizar_texto(mensaje)

    if df is not None and not df.empty:
        coincidencia_exacta = df[df['pregunta'] == msg_norm]
        if not coincidencia_exacta.empty:
            respuesta_exacta = coincidencia_exacta['respuesta'].iloc[0]
            print(f"Q&A - Coincidencia exacta encontrada para: '{msg_norm}'")
            return respuesta_exacta
        else:
            print(f"Q&A - No se encontró coincidencia exacta para: '{msg_norm}'. Usando búsqueda híbrida...")
    else:
        print("!! ADVERTENCIA: DataFrame 'df' no disponible para búsqueda exacta.")

    msg_toks = tokenizar_texto(msg_norm)

    if bm25 is None or embeddings_preguntas is None or embeddings_respuestas is None or modelo_encoder is None:
         print("!! ERROR: BM25 o Embeddings o Encoder no están listos.")
         return "Lo siento, tengo un problema interno para buscar respuestas."

    try:
        puntuaciones_bm25 = bm25.get_scores(msg_toks)
        if len(puntuaciones_bm25) == 0: return "No encontré similitudes iniciales."

        k_bm25_actual = min(k_bm25, len(puntuaciones_bm25))
        if k_bm25_actual == 0: return "No encontré preguntas candidatas."

        indices_top_q = np.argsort(-puntuaciones_bm25)[:k_bm25_actual]

        if len(indices_top_q) == 0 or max(indices_top_q) >= len(embeddings_preguntas) or max(indices_top_q) >= len(embeddings_respuestas):
             print(f"!! ERROR: Índices BM25 inválidos ({indices_top_q}) para embeddings (Q:{len(embeddings_preguntas)}, A:{len(embeddings_respuestas)}).")
             return "Error al procesar índices de búsqueda."

        q_vec = media_oracion(msg_toks).reshape(1, -1)
        sims_q_sub = cosine_similarity(q_vec, embeddings_preguntas[indices_top_q])[0]

        seq = rellenar_vectores(tokens_a_vectores(msg_toks))[None, ...]
        pred_ans_vec = modelo_encoder.predict(seq, verbose=0)[0].reshape(1, -1)
        sims_a_sub = cosine_similarity(pred_ans_vec, embeddings_respuestas[indices_top_q])[0]

        puntuaciones = alfa*sims_a_sub + (1-alfa)*sims_q_sub

        k_final_actual = min(k_final, len(puntuaciones))
        if k_final_actual == 0: return "No pude ordenar las respuestas finales."

        orden = np.argsort(-puntuaciones)[:k_final_actual]

        mejor_indice_relativo = orden[0]

        if mejor_indice_relativo >= len(puntuaciones) or mejor_indice_relativo >= len(indices_top_q):
             print(f"!! ERROR: Índice relativo final inválido ({mejor_indice_relativo}) fuera de límites.")
             return "Error interno al calcular el mejor índice final."

        mejor_indice_absoluto = indices_top_q[mejor_indice_relativo]
        mejor_puntuacion = float(puntuaciones[mejor_indice_relativo])

        print(f"Q&A Híbrido - Mejor score: {mejor_puntuacion:.4f}")

        if mejor_puntuacion < umbral_qa:
            return "No estoy segura de haber entendido. ¿Puedes darme más contexto?"

        if mejor_indice_absoluto >= len(textos_respuestas):
            print(f"!! ERROR: Índice absoluto final inválido ({mejor_indice_absoluto}) fuera de límites para textos_respuestas ({len(textos_respuestas)}).")
            return "Error interno al obtener el texto de la respuesta final."

        return textos_respuestas[mejor_indice_absoluto]

    except Exception as e:
        print(f"!! ERROR durante la respuesta híbrida: {e}")
        traceback.print_exc()
        return "Tuve un problema al buscar la respuesta."

def obtener_respuesta_py(mensaje):
    return responder_hibrido_bm25(mensaje, alfa=0.7, k_bm25=30, k_final=5, umbral_qa=0.50)

def obtener_palabras_clave_spacy(texto):
    if not nlp_es:
        palabras = re.sub(r'[^\w\s]', '', texto).lower().split()
        return list(dict.fromkeys(p for p in palabras if len(p)>2))

    palabras_clave = []
    try:
        doc = nlp_es(texto.lower())
        for token in doc:
            if not token.is_stop and not token.is_punct and token.pos_ in ["NOUN", "VERB", "ADJ"]:
                palabras_clave.append(token.lemma_)
    except Exception as e:
        print(f"!! ERROR en spaCy al procesar texto '{texto[:50]}...': {e}")
        palabras = re.sub(r'[^\w\s]', '', texto).lower().split()
        return list(dict.fromkeys(p for p in palabras if len(p)>2))

    palabras_unicas = list(dict.fromkeys(palabras_clave))
    return palabras_unicas

@lru_cache(maxsize=256)
def buscar_una_palabra_arasaac(palabra):
    try:
        url = f"https://api.arasaac.org/v1/pictograms/es/search/{palabra}"
        respuesta = requests.get(url, timeout=5, verify=True)

        if respuesta.status_code == 200:
            resultados = respuesta.json()
            if resultados:
                mejor_coincidencia = resultados[0]
                if '_id' in mejor_coincidencia:
                    return f"https://api.arasaac.org/v1/pictograms/{mejor_coincidencia['_id']}"
                else:
                    print(f"!! Advertencia: Resultado de ARASAAC para '{palabra}' no tiene '_id'.")
            else:
                pass
        else:
            pass

    except requests.exceptions.Timeout:
        print(f"!! Timeout buscando pictograma para '{palabra}'")
    except Exception as e:
        print(f"!! Error buscando pictograma para '{palabra}': {e}")
    return None

def buscar_pictogramas_py(texto):
    if not isinstance(texto, str) or not texto.strip():
        return []

    print(f"Texto original para pictogramas: '{texto}'")
    palabras_clave = obtener_palabras_clave_spacy(texto)
    print(f"Palabras clave extraídas (lematizadas): {palabras_clave}")

    pictogramas = []
    for palabra in palabras_clave:
        if palabra:
            url_pictograma = buscar_una_palabra_arasaac(palabra)
            if url_pictograma:
                pictogramas.append(url_pictograma)

    print(f"Pictogramas encontrados: {len(pictogramas)}")
    return pictogramas

