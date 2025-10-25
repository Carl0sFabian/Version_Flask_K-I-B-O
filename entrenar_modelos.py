import pandas as pd
from datasets import load_dataset
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import SnowballStemmer
import string
import re
import random
import json
import joblib 
import numpy as np
import tensorflow as tf
from gensim.models import Word2Vec
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
import tensorflow as tf
from keras.models import Sequential
from keras.layers import Input, Masking, LSTM, Dropout, Dense
from keras.optimizers import Adam
print("--- Iniciando script de entrenamiento ---")

# --- 1. Carga de Datos ---
print("Cargando datasets...")
df_combinado = pd.DataFrame()

try:
    df_xnli = pd.read_csv("hf://datasets/Harsit/xnli2.0_train_spanish/spanish_train.csv")
    df_xnli = df_xnli[['premise', 'hypothesis']].copy()
    df_xnli = df_xnli.rename(columns={'premise': 'pregunta', 'hypothesis': 'respuesta'})
    df_xnli['origen'] = 'xnli'
except Exception as e:
    print(f"Error loading xnli2.0_train_spanish: {e}")
    df_xnli = None

splits = {'train': 'train.json', 'validation': 'validation.json', 'test': 'test.json'}
try:
    df = pd.read_json("hf://datasets/benjleite/FairytaleQA-translated-spanish/" + splits["train"])
    df_fairytale = df[['question', 'answer']].copy()
    df_fairytale = df_fairytale.rename(columns={'question': 'pregunta', 'answer': 'respuesta'})
    df_fairytale['origen'] = 'fairytale'
except Exception as e:
    print(f"Error loading FairytaleQA: {e}")
    df_fairytale = None

try:
    ds = load_dataset("Kukedlc/spanish-train")
    df_spanish_train = ds['train'].to_pandas()
    df_spanish_train = df_spanish_train.rename(columns={'instruction': 'pregunta', 'output': 'respuesta'})
    df_spanish_train['origen'] = 'spa_train'
except Exception as e:
    print(f"Error loading spanish-train: {e}")
    df_spanish_train = None

dataframes_combinar = [df for df in [df_xnli, df_fairytale, df_spanish_train] if df is not None]
df_combinado = pd.concat(dataframes_combinar, ignore_index=True)
print(f"Datasets combinados. Total filas: {df_combinado.shape[0]}")

# --- 2. Limpieza y Preprocesamiento ---
print("Limpiando y preprocesando datos...")
df_combinado.dropna(subset=['pregunta', 'respuesta'], inplace=True)
df_combinado['pregunta'] = df_combinado['pregunta'].astype(str).str.strip()
df_combinado['respuesta'] = df_combinado['respuesta'].astype(str).str.strip()
df_combinado = df_combinado[(df_combinado['pregunta'] != '') & (df_combinado['respuesta'] != '')]

word_threshold = 150
df_combinado = df_combinado[
    (df_combinado['pregunta'].apply(lambda x: len(str(x).split())) <= word_threshold) &
    (df_combinado['respuesta'].apply(lambda x: len(str(x).split())) <= word_threshold)
]
df_combinado.drop_duplicates(inplace=True)
print(f"Filas después de limpieza: {df_combinado.shape[0]}")

sample_size = 2000
df_combinado_muestra = df_combinado.groupby('origen').apply(lambda x: x.sample(min(len(x), sample_size), random_state=32)).reset_index(drop=True)
print(f"Muestra estratificada tomada. Total filas: {df_combinado_muestra.shape[0]}")

def normalize_text(text):
    if isinstance(text, str):
        text = re.sub(r'[\n\t]', ' ', text)
        text = text.lower()
        text = re.sub(r'\bq\b', 'que', text)
        text = re.sub(r'\btoy\b', 'estoy', text)
        text = re.sub(r'\bd\b', 'de', text)
        text = re.sub(r'\bpa\b', 'para', text)
        text = re.sub(r'\bt\b', 'te', text)
        text = text.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
        text = re.sub(r'\.$', '', text)
        text = text.replace('"', "'")
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    else:
        return ""

df_combinado_muestra['pregunta'] = df_combinado_muestra['pregunta'].apply(normalize_text)
df_combinado_muestra['respuesta'] = df_combinado_muestra['respuesta'].apply(normalize_text)

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt_tab')

def tokenize_text(text):
    if isinstance(text, str):
        text = re.sub(r'[^\w\s]', '', text)
        tokens = word_tokenize(text, language='spanish')
        return tokens
    else:
        return []

df_combinado_muestra['pregunta_tokenizada'] = df_combinado_muestra['pregunta'].apply(tokenize_text)
df_combinado_muestra['respuesta_tokenizada'] = df_combinado_muestra['respuesta'].apply(tokenize_text)
print("Tokenización completada.")

# --- 3. Guardar el DataFrame procesado ---
df_combinado_muestra.to_csv('datos_procesados.csv', index=False)
print("DataFrame procesado guardado en 'datos_procesados.csv'")


# --- 4. Entrenamiento de Word2Vec ---
print("Entrenando modelo Word2Vec...")
sentences = df_combinado_muestra['pregunta_tokenizada'].tolist() + df_combinado_muestra['respuesta_tokenizada'].tolist()
model_w2v = Word2Vec(sentences, vector_size=100, window=5, min_count=1, workers=4)
EMB_DIM = model_w2v.vector_size
model_w2v.save("model.w2v")
print("Modelo Word2Vec guardado en 'model.w2v'")

# --- 5. Helpers (Definidos aquí para el entrenamiento) ---
def tokens_to_vectors(tokens, emb_dim=EMB_DIM):
    if not tokens: return np.zeros((0, emb_dim), np.float32)
    return np.asarray([model_w2v.wv[t] if t in model_w2v.wv else np.zeros(emb_dim, np.float32)
                       for t in tokens], dtype=np.float32)

def sentence_mean(tokens):
    M = tokens_to_vectors(tokens)
    if M.size == 0: return np.zeros((EMB_DIM,), np.float32)
    mask = ~(M==0).all(axis=1)
    return M[mask].mean(axis=0).astype(np.float32) if mask.any() else np.zeros((EMB_DIM,), np.float32)

MAX_LEN = int(np.percentile(df_combinado_muestra['pregunta_tokenizada'].apply(len), 95))
MAX_LEN = max(16, min(MAX_LEN, 200))
print(f"MAX_LEN establecido en: {MAX_LEN}")

def pad_vectors(mat, max_len=MAX_LEN, emb_dim=EMB_DIM):
    out = np.zeros((max_len, emb_dim), np.float32)
    L = min(max_len, len(mat))
    if L>0: out[:L] = mat[:L]
    return out

# --- 6. Entrenamiento del Codificador LSTM ---
print("Preparando datos para LSTM...")
X = np.stack([pad_vectors(tokens_to_vectors(t)) for t in df_combinado_muestra['pregunta_tokenizada']], axis=0)
y = np.stack([sentence_mean(t) for t in df_combinado_muestra['respuesta_tokenizada']], axis=0)

def cosine_loss(y_true, y_pred):
    y_true = tf.math.l2_normalize(y_true, axis=1)
    y_pred = tf.math.l2_normalize(y_pred, axis=1)
    return 1.0 - tf.reduce_mean(tf.reduce_sum(y_true*y_pred, axis=1))

enc_model = Sequential([
    Input(shape=(MAX_LEN, EMB_DIM)),
    Masking(mask_value=0.0),
    LSTM(128, return_sequences=False),
    Dropout(0.3),
    Dense(128, activation='relu'),
    Dense(EMB_DIM, activation='linear')
])
enc_model.compile(optimizer=Adam(1e-3), loss=cosine_loss)

print("Entrenando modelo LSTM...")
history = enc_model.fit(X, y, epochs=10, batch_size=32, validation_split=0.2, verbose=1)
enc_model.save("lstm_encoder_model.keras")
print("Modelo LSTM guardado en 'lstm_encoder_model.keras'")


# --- 7. Entrenamiento del Clasificador de Intenciones ---
print("Entrenando clasificador de intenciones...")

# Definición de intenciones básicas 
data_intents = {
    "saludo": [
        "hola", "buenas", "buenos dias", "que tal", "buenas tardes",
        "hey", "como estas", "hola, que tal", "holi", "buen dia"
    ],
    "pedir_objeto": [
        "dame la pelota", "quiero un juguete", "puedes darme el libro",
        "necesito mi mochila", "pasame el lapiz", "traeme un vaso de agua",
        "alcánzame eso", "me das la manzana", "quiero eso", "dame uno"
    ],
    "expresar_emocion": [
        "estoy feliz", "me siento triste", "estoy enojado", "que alegria",
        "estoy aburrido", "me siento genial", "estoy contento", "que pena",
        "me da miedo", "estoy sorprendido", "me encanta", "no me gusta", "estoy emocionado"
    ]
}

rows=[]
for k,egs in data_intents.items():
    for t in egs: rows.append({"text": t, "intent": k})
df_int = pd.DataFrame(rows)

clf_intents = Pipeline([
    ("tfidf", TfidfVectorizer(lowercase=True, analyzer="char_wb", ngram_range=(3,5))),
    ("lr", LogisticRegression(max_iter=300, class_weight="balanced"))
]).fit(df_int["text"], df_int["intent"])

joblib.dump(clf_intents, "intent_classifier.joblib")
print("Clasificador de intenciones guardado en 'intent_classifier.joblib'")


print("\n--- [ENTRENAMIENTO COMPLETADO] ---")
print("Todos los modelos y datos han sido guardados.")
print("Archivos creados:")
print("- datos_procesados.csv")
print("- model.w2v")
print("- lstm_encoder_model.keras (carpeta)")
print("- intent_classifier.joblib")