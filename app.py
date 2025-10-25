import os
import re
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, render_template, request, jsonify, url_for
import joblib
import random
import traceback
import json

from conocimiento import (
    obtener_respuesta_py,
    buscar_pictogramas_py,
    clasificar_intencion,
    responder_por_intencion,
    MODELOS_CARGADOS,
    normalizar_texto
)

app = Flask(__name__)

db = None
clf_intenciones = None

try:
    firebase_cred_json_str = os.environ.get('FIREBASE_CREDENTIALS_JSON')
    if firebase_cred_json_str:
        firebase_cred_dict = json.loads(firebase_cred_json_str)
        cred = credentials.Certificate(firebase_cred_dict)
        print("Credenciales de Firebase cargadas desde variable de entorno.")
    else:
        cred = credentials.Certificate('tu-service-account.json')
        print("Credenciales de Firebase cargadas correctamente.")

    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase Admin SDK inicializado correctamente.")
except FileNotFoundError:
     print("ERROR CRÍTICO: No se encontró 'tu-service-account.json' ni variable de entorno.")
     db = None
except Exception as e:
    print(f"ERROR: No se pudo inicializar Firebase Admin.")
    print(f"Detalle del error: {e}")
    db = None

print("Cargando clasificador de intenciones...")
try:
    clf_intenciones = joblib.load("intent_classifier.joblib")
    print("Clasificador de intenciones cargado correctamente.")
except FileNotFoundError:
    print("ERROR: No se pudo cargar 'intent_classifier.joblib'.")
    print("Asegúrate de haber ejecutado 'entrenar_modelos.py' y que el archivo esté en esta carpeta.")
    clf_intenciones = None
except Exception as e:
    print(f"ERROR al cargar 'intent_classifier.joblib': {e}")
    clf_intenciones = None

def leer_script_entrenamiento():
    script_path = 'entrenar_modelos.py'
    try:
        with open(script_path, 'r', encoding='utf-8') as f:
            contenido = f.read()
        titulo = script_path
        descripcion = "Script principal para cargar datos, preprocesarlos y entrenar los modelos de IA (Word2Vec, LSTM Encoder, Clasificador de Intenciones)."
        return titulo, descripcion, contenido
    except FileNotFoundError:
        print(f"!! ADVERTENCIA: No se encontró el archivo '{script_path}' para mostrar en la sección Algoritmos.")
        return "Archivo no encontrado", "Error al cargar el script.", "# Error: El archivo entrenar_modelos.py no se encontró en el servidor."
    except Exception as e:
        print(f"!! ERROR al leer '{script_path}': {e}")
        return "Error de lectura", "Error al cargar el script.", f"# Error al leer el archivo: {e}"

@app.route('/')
def index():
    titulo_algoritmo, desc_algoritmo, codigo_algoritmo = leer_script_entrenamiento()
    return render_template('index.html',
                           algoritmo_titulo=titulo_algoritmo,
                           algoritmo_descripcion=desc_algoritmo,
                           algoritmo_codigo=codigo_algoritmo)

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/api/get_bot_response', methods=['POST'])
def handle_chat_message():
    if db is None:
         print("!! ERROR FATAL: La conexión con Firestore no está disponible.")
         return jsonify({"error": "Error interno del servidor al conectar con la base de datos."}), 500

    try:
        print("\n--- [NUEVA SOLICITUD RECIBIDA] ---")
        data = request.json
        user_text = data.get('text')
        chat_id = data.get('chatId')
        print(f"ChatID: {chat_id}, Texto: {user_text}")

        if not user_text or not chat_id:
            print("!! ERROR: Faltan parámetros 'text' o 'chatId'.")
            return jsonify({"error": "Faltan los parámetros 'text' o 'chatId'"}), 400

        bot_response_text = ""
        INTENCION_SIMPLE_THRESHOLD = 0.55
        intent = None
        score = 0.0

        if clf_intenciones and MODELOS_CARGADOS:
             normalized_user_text = normalizar_texto(user_text)
             intent, score = clasificar_intencion(normalized_user_text, umbral=INTENCION_SIMPLE_THRESHOLD)

             if intent:
                 print(f"Paso 1: Intención detectada -> {intent} (Confianza: {score:.2f} >= {INTENCION_SIMPLE_THRESHOLD})")
                 respuesta_simple = responder_por_intencion(intent, normalized_user_text)
                 if respuesta_simple:
                     bot_response_text = respuesta_simple
                     print(f"Paso 2: Respuesta generada por intención '{intent}'.")
                 else:
                     intent = None
                     print(f"Paso 2: Intención '{intent}' sin respuesta simple. Pasando a Q&A.")
             else:
                 print(f"Paso 1: Intención no detectada con suficiente confianza (Score: {score:.2f} < {INTENCION_SIMPLE_THRESHOLD}). Pasando a Q&A.")
                 intent = None

        if not bot_response_text:
            if not MODELOS_CARGADOS:
                 print("!! ERROR: Modelos Q&A no disponibles.")
                 bot_response_text = "Lo siento, tengo problemas para procesar tu pregunta en este momento."
            else:
                 print("Paso 2: Usando modelo Q&A (conocimiento.py)...")
                 bot_response_text = obtener_respuesta_py(user_text)
                 print(f"Paso 2b: Respuesta de Q&A obtenida: {bot_response_text}")

        print("Paso 3: Buscando pictogramas para la respuesta...")
        pictogramas = buscar_pictogramas_py(bot_response_text)
        print(f"Paso 4: Pictogramas encontrados: {len(pictogramas)}")

        bot_message = {
            'type': 'bot',
            'text': bot_response_text,
            'pictogramas': pictogramas,
            'timestamp': firestore.SERVER_TIMESTAMP,
            'contentType': 'text',
            'rating': 0
        }

        print(f"Paso 5: Preparando para guardar mensaje en Firestore (Chat: {chat_id})...")
        chat_ref = db.collection('chats').document(chat_id)
        chat_ref.collection('messages').add(bot_message)
        print("Paso 6: Mensaje del bot guardado en Firestore.")

        print("Paso 7: Enviando respuesta JSON de éxito al cliente.")
        return jsonify({"status": "success", "response_saved": True}), 200

    except Exception as e:
        print(f"\n--- [ERROR INESPERADO EN /api/get_bot_response] ---")
        print(f"Error: {e}")
        traceback.print_exc()
        return jsonify({"error": "Ocurrió un error interno en el servidor."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

