<table>
<tr>
<td style="vertical-align: top; width: 100px; padding-right: 15px; border: none;">
<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ45DITH77up1n8tb7Bx2n7TO8tBq4I65ZIuw&s", align="left">
</td>
<td style="vertical-align: top; border: none;">
<h1>Universidad Peruana de Ciencias Aplicadas</h1>
<h2>1ASI0404 – Inteligencia Artificial</h2>
<p><strong>Sección:</strong> 5215</p>
<p><strong>Profesor:</strong> Diego Rojas Sihuay</p>
</td>
</tr>
</table>

## 🧑‍💻🤖 KIBO - Chatbot Asistente con Soporte de Pictogramas

KIBO es un chatbot conversacional desarrollado en Python con Flask, diseñado para actuar como un asistente inteligente 🧠. Su principal objetivo es comprender y responder a las entradas del usuario utilizando una combinación de técnicas de Procesamiento de Lenguaje Natural (NLP) y Machine Learning, con un enfoque especial en la accesibilidad a través de la integración de pictogramas ARASAAC ✨.

## 🤖 Funcionalidades Principales

1.  **🔄 Sistema Híbrido de Respuestas:**
    * **👋 Reconocimiento de Intenciones:** Para consultas comunes y directas (saludos, expresiones emocionales, peticiones simples), KIBO utiliza un clasificador de intenciones (entrenado con Scikit-learn) para proporcionar respuestas rápidas y predefinidas.
    * **🔍 Búsqueda y Recuperación Q&A:** Para preguntas más complejas o que no coinciden con una intención simple, KIBO emplea un sistema avanzado de búsqueda:
        * 🎯 Busca coincidencias exactas primero en su base de conocimiento (`datos_procesados.csv`).
        * 🧠 Si no hay coincidencia exacta, combina BM25 (similitud textual) con Embeddings Semánticos (Word2Vec + LSTM Keras/TensorFlow) para encontrar la respuesta más relevante del dataset.
2.  **🖼️ Integración de Pictogramas ARASAAC:**
    * Para mejorar la comprensión y accesibilidad, KIBO analiza cada respuesta con `spaCy` para extraer palabras clave (sustantivos, verbos, adjetivos).
    * Busca automáticamente pictogramas para estas palabras en la API de ARASAAC y los muestra junto al texto.
3.  **🌐 Interfaz Web Interactiva:**
    * Frontend desarrollado con HTML, CSS y JavaScript para una interacción fluida.
    * Utiliza Firebase Firestore 🗃️ para almacenar el historial de conversaciones.

## 🛠️ Tecnologías Utilizadas

* **🐍 Backend:** Python, Flask
* **🤖 NLP/ML:** TensorFlow/Keras (LSTM), Scikit-learn (Intenciones), spaCy (Palabras Clave), NLTK (Tokenización), Gensim (Word2Vec)
* **🗃️ Base de Datos:** Firebase Firestore
* **🔌 API Externa:** ARASAAC (pictogramas)
* **🚀 Hosting:** Render

## 👥 Integrantes

| Apellidos, nombres | Código |
|--------------------|---------|
| Mendoza Quispe Carlos Fabian | U20231C416 |
| Ibarra Cabrera Camila Adriana | U202317287 | 
| Moncada Olivares Elías David | U202315959 | 
| Miranda Cardenas Sofia Gabriel | U20191C439 | 
| Olivera Alvarez Lizbeth Teresita | U201616851 | 
| Huapaya Vargas Daniel José | U202312230 | 
| Abanto Davila Alvaro Jair Moises | U202313540 | 
| Antonio Moran Jose David | U202223356 | 
| Toledo Mamani Wilber Franz | U202320608 | 
| Rojas Sánchez Patricia Lucía del Rosario | U202310474 | 

## 💼 📋 Roles asignados para el proyecto

| Integrante | Rol (según el enunciado) | Tareas |
|-------------|---------------------------|--------|
| Abanto Dávila, Álvaro Jair Moisés | Scrum Master | Introducción y situación de contexto real |
| Antonio Morán, José David | UI/UX Designer | Introducción y situación de contexto real |
| Huapaya Vargas, Daniel José | Data Engineer | Introducción y situación de contexto real |
| Ibarra Cabrera, Camila Adriana | Data Scientist | Adquisición de datos |
| Mendoza Quispe, Carlos Fabián | Developer | Experimentos |
| Miranda Cárdenas, Sofía Gabriel | Data Scientist | Propuesta técnica |
| Moncada Olivares, Elías David | Data Engineer | Propuesta técnica |
| Olivera Álvarez, Lizbeth Teresita | Developer | Propuesta técnica |
| Rojas Sánchez, Patricia Lucía del Rosario | Data Engineer | Ingeniería de características |
| Toledo Mamani, Wilber Franz | QA Tester | Propuesta técnica |










## 📝 Introducción

El **Trastorno del Espectro Autista (TEA)** es una condición del neurodesarrollo que impacta la comunicación, la interacción social y el comportamiento. Según la **Organización Mundial de la Salud (OMS, 2025)**, se estima que **1 de cada 100 niños** en el mundo presenta TEA, lo que plantea un desafío significativo para la inclusión educativa y social. Las dificultades en la comunicación verbal y la comprensión de interacciones sociales son barreras importantes que estos niños enfrentan a diario.

Este proyecto se enfoca en el **diseño y desarrollo de un chatbot inclusivo**, una herramienta tecnológica de asistencia diseñada específicamente para niños con TEA. El objetivo principal es **facilitar la comunicación y el aprendizaje** a través de una interfaz amigable que utiliza pictogramas, opciones visuales y lenguaje sencillo.  Al crear un canal de comunicación adaptado a sus necesidades, buscamos **potenciar su autonomía, reducir la ansiedad social y contribuir al desarrollo de sus habilidades comunicativas**, promoviendo así su inclusión en diversos contextos.

---

## Descripción del contexto

El **Trastorno del Espectro Autista (TEA)** representa una realidad tangible en millones de hogares, escuelas y comunidades en todo el mundo. Más allá de la estadística de la OMS (2025) que indica que 1 de cada 127 niños vive con esta condición, existe un contexto diario de desafíos comunicativos que impacta profundamente su calidad de vida y su inclusión social. Un niño con TEA no solo tiene “dificultades para comunicarse”, sino que puede ser incapaz de expresar necesidades básicas como *“tengo hambre”* o *“algo me duele”*, lo que a menudo deriva en episodios de frustración y ansiedad que son mal interpretados como problemas de conducta.

En el entorno educativo, un maestro puede dar una instrucción simple como *“saquen su cuaderno y abran la página 20”*, pero para un niño con TEA, esta secuencia de dos pasos puede ser una barrera insuperable sin apoyo visual. Esta desconexión entre el lenguaje verbal y su procesamiento cognitivo puede llevar a retraso académico y a un sentimiento de aislamiento respecto a sus compañeros. En el ámbito social, la incapacidad para interpretar el lenguaje no verbal —como las expresiones faciales o el tono de voz— dificulta la creación de lazos de amistad, dejando a muchos niños al margen de las interacciones grupales.

Los padres y terapeutas emplean herramientas como los **Sistemas Aumentativos y Alternativos de Comunicación (SAAC)**, principalmente tarjetas físicas con pictogramas.  
Si bien son efectivos, estos sistemas son estáticos, limitados en vocabulario y poco prácticos para una comunicación fluida.  
El contexto real es, por tanto, una brecha persistente entre la necesidad del niño de comunicarse y las herramientas disponibles para hacerlo de manera efectiva, autónoma y adaptada al mundo digital en el que crece. Este proyecto nace de la necesidad de cerrar esa brecha.

---

## Fundamento de la solución

La tecnología ofrece una oportunidad única para crear entornos de comunicación adaptados a las necesidades de los niños con TEA. A diferencia de las interacciones humanas, que pueden ser impredecibles y abrumadoras, un chatbot bien diseñado ofrece un canal de comunicación predecible, paciente y libre de juicios. La solución propuesta consiste en un asistente conversacional que integra tres pilares fundamentales: lenguaje sencillo, para reducir la carga cognitiva; soporte pictográfico, utilizando el sistema ARASAAC para asociar conceptos con imágenes claras y consistentes; e interactividad guiada, que ofrece opciones de respuesta para facilitar la construcción de diálogos. Este enfoque no busca reemplazar la terapia, sino complementar, proporcionando una herramienta accesible que permite a los niños practicar habilidades comunicativas en un entorno seguro, aumentando su autonomía y confianza.

---

## Objetivos

**Objetivo general:**  
Diseñar y desarrollar un prototipo de chatbot que facilite la comunicación funcional en niños con TEA mediante una interfaz basada en texto, voz y pictogramas.

**Objetivos específicos:**
- Adquirir y preprocesar un conjunto de datos conversacionales relevante y adaptado a las necesidades comunicativas de los niños con TEA.
- Entrenar y evaluar dos modelos de Inteligencia Artificial (uno basado en reglas y otro de aprendizaje profundo) para la gestión del diálogo y la generación de respuestas.
- Desarrollar una interfaz gráfica de usuario (GUI) intuitiva y accesible que integre la entrada y salida de texto, voz y pictogramas.
- Validar la usabilidad y efectividad del prototipo con casos de prueba simulados que reflejan escenarios de la vida real.

---

# Adquisición de los Datos

## Obtención de datos

La base para un modelo de IA conversacional robusto es un conjunto de datos diverso y de alta calidad. El proceso para construir nuestro dataset se centró en la obtención, combinación y limpieza de múltiples fuentes de datos para entrenamiento de modelos de IA en español. Para ello, se realizó una búsqueda exhaustiva en plataformas de datasets como Github, Kaggle y Hugging Face. Finalmente, se seleccionaron tres conjuntos de datos de Hugging Face, obteniéndose mediante las librerías de pandas y datasets en Google Colab.

Los datasets fuente fueron:

- **Harsit/xnli2.0_train_spanish:** Es parte de la Cross-lingual Natural Language Inference (XNLI) corpus. Se compone de pares de frases (premisa e hipótesis) en español. Es útil para tareas de comprensión del lenguaje natural y razonamiento, ya que aporta pares de frases que ayudan al modelo a entender el razonamiento y la inferencia.  Se obtuvo el dataset leyendo la ruta del archivo csv publicado de la fuente original.

  Obtenido de: [https://huggingface.co/datasets/Harsit/xnli2.0_train_spanish](https://huggingface.co/datasets/Harsit/xnli2.0_train_spanish)

    ```python
    # Cargar el dataset "xnli2.0_train_spanish"
    # Fuente: https://huggingface.co/datasets/Harsit/xnli2.0_train_spanish
    
    try:
        df_xnli = pd.read_csv("hf://datasets/Harsit/xnli2.0_train_spanish/spanish_train.csv")
    except Exception as e:
        print(f"Error loading xnli2.0_train_spanish: {e}")
        df_xnli = None
    
    if df_xnli is not None:
        df_xnli = df_xnli[['premise', 'hypothesis']].copy()
        df_xnli = df_xnli.rename(columns={'premise': 'pregunta', 'hypothesis': 'respuesta'})
        df_xnli = df_xnli[['pregunta', 'respuesta']]

- **Benjleite/FairytaleQA-translated-spanish:** Contiene preguntas y respuestas sobre cuentos infantiles en español. Es útil para tareas de respuesta a preguntas y comprensión de lectura. Dado que contiene preguntas y respuestas sencillas sobre cuentos infantiles, es un material temático ideal para nuestro público objetivo. El dataset se obtuvo mediante una lectura de json de los datos de entrenamiento de la fuente de origen.

  Obtenido de: [https://huggingface.co/datasets/benjleite/FairytaleQA-translated-spanish](https://huggingface.co/datasets/benjleite/FairytaleQA-translated-spanish)

  ```python
  # Cargar el dataset "FairytaleQA-translated-spanish"
  # Fuente: https://huggingface.co/datasets/benjleite/FairytaleQA-translated-spanish
  
  splits = {'train': 'train.json', 'validation': 'validation.json', 'test': 'test.json'}
  df = pd.read_json("hf://datasets/benjleite/FairytaleQA-translated-spanish/" + splits["train"])
  
  if 'df' in globals() and df is not None:
      df_fairytale = df[['question', 'answer']].copy()
      df_fairytale = df_fairytale.rename(columns={'question': 'pregunta', 'answer': 'respuesta'})
      df_fairytale = df_fairytale[['pregunta', 'respuesta']]
  else:
      df_fairytale = None
      print("FairytaleQA-translated-spanish dataframe not found.")


- **Kukedlc/spanish-train:** Contiene pares de instrucción y pregunta en español (equivalentes a input y output) de conversaciones e interacciones de un chatbot externo. Ofrece un corpus general de instrucciones y respuestas útil como conocimiento general del chatbot sobre diversos dominios de temas más avanzados. Asimismo, ofrece una estructura de ejemplo para estructurar las respuestas. Se obtuvieron los datos mediante `load_dataset`, una función que permite cargar conjunto de datos de Hugging Face.

  Obtenido de: [https://huggingface.co/datasets/Kukedlc/spanish-train](https://huggingface.co/datasets/Kukedlc/spanish-train)

  ```python
  # Cargar el dataset "spanish-train"
  # Fuente: https://huggingface.co/datasets/Kukedlc/spanish-train
  
  ds = load_dataset("Kukedlc/spanish-train")
  
  if 'ds' in globals() and ds is not None:
      df_spanish_train = ds['train'].to_pandas()
      df_spanish_train = df_spanish_train.rename(columns={'instruction': 'pregunta', 'output': 'respuesta'})
      df_spanish_train = df_spanish_train[['pregunta', 'respuesta']]
  else:
      df_spanish_train = None
      print("spanish-train dataset not found.")

## Descripción del conjunto de datos

En lugar de partir de un único archivo, nuestro conjunto de datos final es el resultado de la **combinación de tres fuentes distintas** obtenidas desde el **hub de Hugging Face**.  
Este enfoque garantiza una amplia variedad de **estilos de conversación, temas y niveles de complejidad**.

Estos datasets se cargaron y sus columnas se **estandarizaron a un formato común de pregunta y respuesta** antes de ser combinados en un único archivo.  
De este gran conjunto de datos, se extrajo una **muestra aleatoria** para crear el archivo que se utilizará en la fase de desarrollo:  
`combined_dataset_sample_5000.csv`.

## Preprocesamiento de datos

Antes de que los datos pudieran ser utilizados, se aplicó un proceso de **limpieza fundamental** sobre el dataset combinado (de más de **1.3 millones de filas**) para asegurar su calidad e integridad.  
Los pasos fueron los siguientes:

- **Limpieza de Nulos y Espacios en Blanco:** Se eliminaron todas las filas que no contenían valor en la columna *pregunta* o *respuesta*. Adicionalmente, se removieron los espacios en blanco al inicio y al final de cada texto para descartar registros que solo contenían espacios vacíos.
  ```python
  # Eliminar filas donde 'pregunta' o 'respuesta' sean null o estén vacías
  df_combinado.dropna(subset=['pregunta', 'respuesta'], inplace=True)
  
  # Eliminar espacios iniciales y finales
  df_combinado['pregunta'] = df_combinado['pregunta'].astype(str).str.strip()
  df_combinado['respuesta'] = df_combinado['respuesta'].astype(str).str.strip()
  
  # Hacer una segunda eliminación de datos en blanco
  df_combinado = df_combinado[(df_combinado['pregunta'] != '') & (df_combinado['respuesta'] != '')]

- **Eliminación de Duplicados:** Se aplicó una función para borrar todas las filas que eran copias exactas de otras. Este paso es crucial para evitar que el modelo de IA se sobreajuste a ejemplos repetidos y para garantizar que el conjunto de datos sea lo más variado posible.
  ```python
  # Eliminar duplicados
  df_combinado.drop_duplicates(inplace=True)

- **Limitación de extensión de las cadenas de texto:** Se implementó un filtro para eliminar aquellas cadenas de texto que superaran las **150 palabras**. Dado que el modelo está en una etapa inicial, se optó por trabajar con un dataset limitado y controlado.
  ```python
  # Eliminar filas con más de 150 palabras en 'pregunta' o 'respuesta'
  word_threshold = 150
  df_combinado = df_combinado[
      (df_combinado['pregunta'].apply(lambda x: len(str(x).split())) <= word_threshold) &
      (df_combinado['respuesta'].apply(lambda x: len(str(x).split())) <= word_threshold)
  ]

- **Normalización del texto:** Se estandarizó todo el texto, transformando las cadenas a **minúsculas**, eliminando **saltos de línea (\n)** y **tabulaciones (\t)**, y manejando algunas contracciones (por ejemplo, convertir *‘q’* en *que*). Este paso es importante para evitar inconsistencias al aplicar los algoritmos y asegurar que los resultados sean coherentes.
  ```python
  def normalize_text(text):
      if isinstance(text, str):
          #Eliminar saltos de línea y tabulaciones
          text = re.sub(r'[\n\t]', ' ', text)
          #Convertir a minúsculas
          text = text.lower()
          #Manejar constracciones más comunes
          text = re.sub(r'\bq\b', ' que', text)
          text = re.sub(r'\btoy\b', ' estoy', text)
          text = re.sub(r'\bd\b', ' de', text)
          text = re.sub(r'\bpa\b', ' para', text)
          text = re.sub(r'\bt\b', ' te', text)
          #Eliminar solo el punto final si existe
          text = re.sub(r'\.$', '', text)
          #Reemplazar comillas dobles por comillas simples
          text = text.replace('"', "'")
          #Eliminar posibles espacios duplicados
          text = re.sub(r'\s+', ' ', text).strip()
          return text
      else:
          return ""

- **Tokenización del texto:** Se empleó un algoritmo de **tokenización** para dividir las cadenas de texto en palabras. Se agregaron nuevas columnas al dataset con los textos tokenizados, lo que proporciona flexibilidad para trabajar tanto con las cadenas completas como con las tokenizadas. Además, permite aplicar algoritmos de **procesamiento de lenguaje natural (NLP)** con mayor efectividad.
  ```python
  def tokenize_text(text):
      if isinstance(text, str):
          tokens = word_tokenize(text, language='spanish')
          tokens = [t for t in tokens if t not in string.punctuation]
          return tokens
      else:
          return []

Una vez realizados estos procesos, se garantiza que el dataset es de **alta calidad**, sin datos corruptos, redundantes o poco eficientes para la construcción del modelo. Sin embargo, todavía se tiene un volumen considerable de datos no óptimo para procesar por los algoritmos seleccionados (**828,050 registros**). Por esta razón, se considerará una **muestra final de 6,000 registros aleatorios**, utilizando un **muestreo estratificado** con cada dataset como estrato.

A continuación se muestra información sobre el conjunto final de datos obtenido luego de la limpieza realizada.

| **Columna**             | **Tipo de variable** | **Descripción** |
|--------------------------|----------------------|-----------------|
| **pregunta**             | *string*             | Es la pregunta o enunciado normalizado del dataset original. |
| **respuesta**            | *string*             | Es la respuesta o interpretación normalizada correspondiente a la pregunta. |
| **origen**               | *string*             | Dataset de origen del registro, es de tipo categórico y puede ser “xnli”, “fairytale” o “spa_train”. |
| **pregunta_tokenizada**  | *arreglo*            | Es un vector compuesto de las palabras que componen la pregunta o enunciado tokenizado. |
| **respuesta_tokenizada** | *arreglo*            | Es un vector compuesto de las palabras que componen la respuesta o interpretación tokenizada. |

**Código:** [🔗 Parcial - Dataset-Chatbot-IA.ipynb](https://colab.research.google.com/drive/10sadXm8uxeJ6Hcwe1_mPFU0VbCz5NURx?usp=sharing)

### *Product Backlog*

#### *Épicas*

| ID | Nombre |
| :--- | :--- |
| EP1 | Como usuario, quiero que el chatbot use lenguaje sencillo y claro, para entender y comunicarse de manera efectiva. |
| EP2 | Como usuario, quiero comunicarme con pictogramas para aprender a asociar mis necesidades y emociones con imágenes. |
| EP3 | Como usuario, quiero personalizar el chatbot para adaptarlo a las rutinas y necesidades del niño. |
| EP4 | Como usuario, quiero que la interfaz gráfica sea intuitiva y accesible, para que los niños interactúen con el chatbot de manera fácil y cómoda. |
| EP5 | Como usuario, quiero que el chatbot sea capaz de gestionar conversaciones usando modelos de IA basados en reglas y aprendizaje profundo, para generar respuestas adecuadas y coherentes. |
| EP6 | Como usuario, quiero que el chatbot tenga recompensas visuales para motivar a los niños a usarlo constantemente y seguir interactuando. |

-----

### *Historias de Usuario*

| Epic ID | ID | Nombre | Descripción | Criterios de Aceptación | Story points |
| :--- | :--- | :--- | :--- | :--- | :--- |
| *EP1* | *US01* | Comprensión de la problemática | Como desarrollador, quiero investigar la problemática de la comunicación en niños con TEA y el buen uso de herramientas tecnológicas para entender sus necesidades específicas y desarrollar un producto que aborde las barreras comunicativas. | *Escenario 1:* Investigación sobre el contexto de la problemática<br>Dado que se realiza una búsqueda profunda de estudios sobre el TEA, cuando se consulta fuentes científicas, artículos y entrevistas con expertos, entonces se obtiene información relevante y específica sobre el contexto de la problemática.<br><br>*Escenario 2:* Planteamiento del fundamento de la solución<br>Dado que se realiza una búsqueda profunda de herramientas tecnológicas aplicadas en niños con TEA, cuando se consulta fuentes científicas, artículos y entrevistas con expertos, entonces se obtiene información relevante para plantear la solución de un chatbot.<br><br>*Escenario 3:* Planteamiento de los objetivos<br>Dado que se realiza una búsqueda profunda de herramientas tecnológicas aplicadas en niños con TEA, cuando se consulta fuentes científicas, artículos y entrevistas con expertos, entonces se plantea el objetivo general y objetivos específicos del trabajo. | 5 |
| *EP1* | *US02* | Recibir respuestas simples por el chatbot | Como desarrollador, quiero que el chatbot use frases cortas y simples, para que los niños con TEA puedan procesar la información fácilmente. | *Escenario 1:* Respuesta con frases cortas y simples<br>Dado que un niño con TEA ingresa envía un mensaje al chatbot, cuando el chatbot procesa el mensaje, entonces se envía una respuesta clara, fácil de entender y compuesta de frases simples y directas.<br><br>*Escenario 2:* Respuesta con frases complejas<br>Dado que un niño con TEA envía un mensaje al chatbot, cuando el chatbot procesa el mensaje y genera una respuesta utilizando frases largas, entonces se intenta generar otra respuesta. | 2 |
| *EP1* | *US03* | Recibir respuestas claras por el chatbot | Como niño con TEA, quiero que el chatbot proporcione respuestas claras y directas, para evitar confundirme con un lenguaje complejo. | *Escenario 1:* Respuesta clara y directa<br>Dado que un niño con TEA ingresa envía un mensaje al chatbot, cuando el chatbot procesa el mensaje, entonces se envía una respuesta directa con un lenguaje claro.<br><br>*Escenario 2:* Respuesta confusa o compleja<br>Dado que un niño con TEA envía un mensaje al chatbot, cuando el chatbot procesa el mensaje y genera una respuesta compleja, entonces se intenta generar otra respuesta. | 2 |
| *EP2* | *US04* | Integración de pictogramas en las respuestas del chatbot | Como desarrollador, quiero integrar pictogramas de ARASAAC en cada respuesta del chatbot, para facilitar la comprensión de las respuestas mediante imágenes. | *Escenario 1:* Respuesta con un pictograma<br>Dado que un niño con TEA envía un mensaje de menos de 10 palabras, cuando el chatbot genera la respuesta, entonces se muestra un pictograma asociado a la respuesta.<br><br>*Escenario 2:* Respuesta con más de un pictograma<br>Dado que un niño con TEA envía un mensaje con más de 10 palabras, cuando el chatbot genera la respuesta, entonces se muestran de 2 a 5 pictogramas asociados a la respuesta.<br><br>*Escenario 3:* Respuesta sin pictograma<br>Dado que un niño con TEA envía un mensaje, cuando el chatbot genera la respuesta y no encuentra pictogramas asociados correctamente, entonces envía un mensaje de error lamentando no poder adjuntar los pictogramas. | 5 |
| *EP2* | *US05* | Integración de pictogramas en los mensajes recibidos por el chatbot | Como niño con TEA, quiero que mis mensajes sean acompañados por pictogramas, para aprender a expresar mis pensamientos y sentimientos. | *Escenario 1:* Mensaje con un pictograma<br>Dado que un niño con TEA envía un mensaje de menos de 10 palabras, cuando la aplicación recibe el mensaje, entonces se muestra un pictograma asociado.<br><br>*Escenario 2:* Mensaje con más de un pictograma<br>Dado que un niño con TEA envía un mensaje con más de 10 palabras, cuando la aplicación recibe el mensaje, entonces se muestran de 2 a 5 pictogramas asociados.<br><br>*Escenario 3:* Mensaje sin pictograma<br>Dado que un niño con TEA envía un mensaje, cuando la aplicación recibe el mensaje y no encuentra pictogramas asociados correctamente, entonces no se muestran pictogramas junto al mensaje enviado. | 8 |
| *EP2* | *US06* | Configuración de pictogramas personalizados | Como terapeuta quiero agregar imágenes en el chatbot para adaptar la comunicación a cada niño. | *Escenario 1:* Agregar un pictograma correctamente<br>Dado que soy un terapeuta y estoy en una conversación con el chatbot, cuando selecciono la opción de agregar un nuevo pictograma, entonces se muestra un formulario para cargar la imagen y asociar una categoría y aparece un mensaje de éxito.<br><br>*Escenario 2:* Fallo al agregar un pictograma<br>Dado que soy un terapeuta y estoy en una conversación con el chatbot, cuando intento agregar un pictograma sin una imagen válida o compatible, entonces el sistema muestra un mensaje de error que indica que la imagen no es válida y me solicita cargar una imagen compatible. | 5 |
| *EP3* | *US07* | Crear las conversaciones con el chatbot | Como desarrollador, quiero que el chatbot ofrezca la creación de varias conversaciones, para evitar sobrecargar al usuario y al modelo con diversos conceptos y temas en una sola conversación. | *Escenario 1:* Creación de varias conversaciones<br>Dado que un usuario se encuentra en la pantalla principal, cuando hace clic en la opción de “Nuevo chat” y escribe un nombre y descripción del chat, entonces inicia una nueva conversación con el chatbot.<br><br>*Escenario 2:* Falla en la creación de nuevas conversaciones<br>Dado que un usuario se encuentra en la pantalla principal, cuando hace clic en la opción de “Nuevo chat” y escribe un nombre y descripción del chat y la conversación no se crea, entonces se manda un mensaje de error para volver a intentarlo más tarde. | 3 |
| *EP3* | *US08* | Mantener más de una conversación con el chabot | Como niño con TEA, quiero conversar varios chats, para practicar mis habilidades comunicativas de manera progresiva. | *Escenario 1:* Acceder a las nuevas conversaciones sin confusión<br>Dado que se tiene una nueva conversación, cuando se habla de un nuevo tema con el chatbot, entonces se envían respuestas independientes de otras conversaciones guardadas.<br><br>*Escenario 2:* Imposibilidad de acceder a nuevas conversaciones<br>Dado que se tiene una nueva conversación, cuando se habla de un nuevo tema con el chatbot y el chatbot responde con temas de otras conversaciones guardadas, entonces el terapeuta reporta el error al equipo de desarrollo. | 3 |
| *EP3* | *US09* | Visualizar las conversaciones con el chatbot | Como niño con TEA, quiero visualizar las distintas conversaciones del niño, para hablar de diversos temas sin confusión. | *Escenario 1:* Visualización de conversaciones actuales<br>Dado que un niño con TEA accede a una conversación, cuando la interfaz se carga, entonces se muestran los mensajes enviados de la conversación seleccionada.<br><br>*Escenario 2:* Visualización de conversaciones pasadas<br>Dado que un niño con TEA accede a una conversación, cuando la interfaz se carga y se muestran mensajes de otras conversaciones no seleccionadas, entonces el terapeuta reporta el error al equipo de desarrollo. | 2 |
| *EP4* | *US10* | Diseño de la interfaz | Como desarrollador, quiero que la interfaz sea sencilla y expresiva, para que los niños con TEA interactúen con ella sin problema. | *Escenario 1:* Interfaz intuitiva y accesible<br>Dado que un usuario accede al chatbot, cuando el menú principal carga, entonces se muestran correctamente los colores elegidos, componentes bien colocados y transiciones diseñadas.<br><br>*Escenario 2:* Interfaz confusa o sobrecargada<br>Dado que un usuario accede al chatbot, cuando el menú principal carga y hay un error al cargar los colores elegidos, colocar los componentes y ejecutar las transiciones, entonces el sistema envía un mensaje de espera y vuelve a cargarse. | 5 |
| *EP4* | *US11* | Botones y componentes de la interfaz | Como niño con TEA, quiero que la interfaz tenga botones grandes y fáciles de presionar, para poder interactuar sin dificultad. | *Escenario 1:* Botones grandes y fáciles de presionar<br>Dado que un niño con TEA está utilizando la interfaz del chatbot, cuando interactúa con la interfaz, entonces los botones son lo suficientemente grandes, con un diseño claro, y se pueden presionar sin dificultad.<br><br>*Escenario 2:* Botones pequeños o difíciles de presionar<br>Dado que un niño con TEA está utilizando la interfaz del chatbot, cuando interactúa con la interfaz, entonces los botones son demasiado pequeños o están mal ubicados, lo que dificulta la interacción, causa frustración y los desmotiva. | 1 |
| *EP4* | *US12* | Texto y opciones multimedia del chatbot | Como terapeuta, quiero que la interfaz sea accesible y adaptada a las necesidades de cada niño, con buena legibilidad del texto, voz y pictogramas para que puedan utilizarla con ánimo y motivación. | *Escenario 1:* Buena legibilidad del texto<br>Dado que un niño con TEA está utilizando la interfaz del chatbot, cuando interactúa con la interfaz, entonces el tamaño de letra y la tipografía del texto son legibles y con buen contraste con el color de fondo.<br><br>*Escenario 2:* Disponibilidad para subir imágenes y grabar audios<br>Dado que un niño con TEA está utilizando la interfaz del chatbot, cuando está en una conversación, entonces puede subir imágenes o grabar audio.<br><br>*Escenario 3:* Fallo al cargar las configuraciones de texto, subida de imágenes o carga de audio<br>Dado que un niño con TEA está utilizando la interfaz del chatbot, cuando no se cargan las configuraciones de texto, lógica de carga de imágenes o grabación de audio, entonces el sistema pide recargar la página para volver a ejecutar las configuraciones correctamente. | 3 |
| *EP5* | *US13* | Conjunto de datos | Como desarrollador, quiero buscar, adquirir y preprocesar un conjunto de datos conversacionales, para entrenar los modelos de IA de manera efectiva. | *Escenario 1:* Conjunto de datos adecuado y preprocesado<br>Dado que se busca un conjunto de datos conversacionales, cuando el desarrollador adquiere y preprocesa los datos, entonces el conjunto de datos es limpio y estructurado, adecuado para ser utilizado en el entrenamiento de modelos de IA.<br><br>*Escenario 2:* Conjunto de datos incompleto o mal preprocesado<br>Dado que se busca un conjunto de datos conversacionales, cuando el desarrollador adquiere y preprocesa los datos, y el conjunto de datos está incompleto, desorganizado o mal procesado, entonces se vuelve a buscar otro conjunto de datos que sea adecuado. | 8 |
| *EP5* | *US14* | Entrenamiento del modelo | Como desarrollador, quiero entrenar un modelo basado en reglas para gestionar diálogos sencillos y predecibles en el chatbot. | *Escenario 1:* Modelo basado en reglas entrenado exitosamente<br>Dado que se entrena el modelo basado en reglas, cuando el modelo procesa una entrada de texto, entonces el chatbot responde de manera coherente y predecible, siguiendo las reglas predefinidas del sistema.<br><br>*Escenario 2:* Modelo basado en reglas fallido o incorrecto<br>Dado que se entrena el modelo basado en reglas, cuando el modelo procesa una entrada de texto y el chatbot responde incorrectamente, sin seguir las reglas definidas, entonces se plantean nuevos algoritmos de entrenamiento o un nuevo dataset. | 8 |
| *EP5* | *US15* | Coherencia de respuestas del chatbot | Como terapeuta, quiero que el chatbot de respuestas coherentes, para ayudar a los niños a practicar habilidades de comunicación. | *Escenario 1:* Respuesta coherente del chatbot<br>Dado que un niño con TEA interactúa con el chatbot, cuando se envía una respuesta a un mensaje de entrada, entonces la respuesta es coherente, adecuada al contexto, y facilita el desarrollo de habilidades de comunicación.<br><br>*Escenario 2:* Respuesta incoherente del chatbot<br>Dado que un niño con TEA interactúa con el chatbot, cuando se envía una respuesta a un mensaje de entrada y la respuesta es incoherente, entonces se dificulta el aprendizaje de habilidades de comunicación. | 5 |
| *EP6* | *US16* | Integrar medallas y recompensas por interactuar con el chatbot | Como desarrollador, quiero integrar recompensas visuales como estrellas o medallas después de cada interacción exitosa, para motivar a los niños a seguir utilizando el chatbot. | *Escenario 1:* Recompensas visuales integradas correctamente<br>Dado que un niño con TEA interactúa con el chatbot, cuando envía cierta cantidad de mensajes o mantiene cierta cantidad de conversaciones, entonces recibe una recompensa visual, como una estrella o medalla, que aparece de manera clara y motivadora.<br><br>*Escenario 2:* Recompensas visuales no generadas<br>Dado que un niño con TEA interactúa con el chatbot, cuando envía cierta cantidad de mensajes o mantiene cierta cantidad de conversaciones pero no recibe una recompensa visual, entonces el niño se siente desmotivado. | 3 |
| *EP6* | *US17* | Progresión de las recompensas a mayor interacción con el chatbot | Como terapeuta, quiero que las recompensas visuales se alineen con sus niveles de habilidad, para incentivar el uso del chatbot y el desarrollo de sus habilidades comunicativas. | *Escenario 1:* Recompensas visuales alineadas con los niveles de habilidad<br>Dado que un niño con TEA interactúa con el chatbot, cuando genera más interacciones, entonces las tareas son más desafiantes y las recompensas más llamativas.<br><br>*Escenario 2:* Recompensas visuales no alineadas con los niveles de habilidad<br>Dado que un niño con TEA interactúa con el chatbot, cuando genera más interacciones y no hay progreso en las misiones dadas, entonces el niño no se siente motivado a seguir interactuando. | 5 |

[4:17 p.m., 11/10/2025] Camila Ibarra: ### *Product Backlog*

#### *Épicas*

| ID | Nombre |
| :--- | :--- |
| EP1 | Como usuario, quiero que el chatbot use lenguaje sencillo y claro, para entender y comunicarse de manera efectiva. |
| EP2 | Como usuario, quiero comunicarme con pictogramas para aprender a asociar mis necesidades y emociones con imágenes. |
| EP3 | Como usuario, quiero personalizar el chatbot para adaptarlo a las rutinas y necesidades del niño. |
| EP4 | Como usuario, quiero que la interfaz gráfica sea intuitiva y accesible, para que los niños interactúen con el chatbot de manera fácil y cómoda. |
| EP5 | Como usuario, quiero que el chatbot sea capaz de gestionar conversaciones usando modelos de IA basados en reglas y aprendizaje…
[4:22 p.m., 11/10/2025] Camila Ibarra: Claro, aquí tienes la información estructurada en formato Markdown.
Va despues del cronograma
---

## *Plan por Fases (CRISP-DM) y Cronograma*

### *Fase 1 — Comprensión del negocio (Sem 1: 15–21 Sep)*
- Análisis de necesidades y casos de uso del usuario (niños con dificultades comunicativas), objetivos de éxito y consideraciones éticas/ciudadanía.
- Definir alcance del asistente: NLP + módulo de pictogramas + GUI + API.
- *Entregable:* objetivos y criterios de aceptación.

### *Fase 2 — Comprensión de datos (Sem 2: 22–28 Sep)*
- Identificar y justificar fuentes de datos y licencias; bosquejar diccionario de datos.
- Realizar EDA inicial y primeras visualizaciones.
- *Entregable:* fuentes documentadas.

### *Fase 3 — Preparación de datos (Sem 3: 29 Sep–5 Oct)*
- Limpiar, normalizar y estandarizar a un formato común (train/val/test).
- Elaborar el data dictionary.
- *Entregables:* dataset limpio + cuaderno EDA.

### *Fase 4 — Modelado (Sem 4–6: 6–26 Oct)*
- Construir baseline rápido (reglas / TF-IDF + Naive Bayes o Regresión Logística).
- Iterar con embeddings en español + SVM/BiLSTM; prototipo de mapeo texto→pictogramas.
- *Entregable:* modelo baseline y versión mejorada.

### *Fase 5 — Evaluación (Sem 7–10: 27 Oct–16 Nov)*
- Probar backend/frontend y casos simulados de interacción; manejar errores y ajustar UX.
- Serializar el modelo (joblib/pickle) y medir latencia.
- *Entregables:* reportes de pruebas y modelo serializado.

### *Fase 6 — Despliegue (Sem 11–15: 17–30 Nov)*
- Integrar GUI con el modelo (inputs: texto/pictos; outputs: texto/voz/pictos) y documentar API REST; ejecutar pruebas integradas.
- Preparar manual de usuario y paquete final (código, datos de ejemplo, modelo).
- *Entregables:* build final, paquete completo, informe y demo (“release”).

---

## *Propuesta de Técnicas y Algoritmos*

Se prioriza un diseño simple y transparente apto para ejecución local. Se parte de un baseline y se escalará únicamente si las métricas lo requieren. La solución comprende cuatro componentes: control del diálogo, clasificación de intenciones, extracción de información clave y asociación de texto a pictogramas.

A continuación, se detallan los componentes y algoritmos seleccionados:

### *Agentes basados en conocimiento y lógica (control del diálogo)*
El flujo conversacional (saludo → identificación de necesidad → confirmación → cierre) se manejará con una máquina de estados apoyada en reglas. Según McTear et al. (2016), las máquinas de estados finitas proporcionan un modelo formal efectivo para mapear flujos conversacionales estructurados en sistemas de diálogo. Cada cambio de estado ocurre cuando se cumple algo observable (por ejemplo, que la intención fue detectada con suficiente confianza o que ya se completó un dato necesario). Si el sistema no está seguro, se activa un mecanismo de respaldo que pide aclarar o confirmar antes de seguir. Este enfoque es fácil de entender y de depurar, y encaja bien con el alcance del proyecto.

### *Procesamiento de Lenguaje Natural (NLP): minería y análisis de texto*
Para reconocer intenciones, convertimos el texto a números con TF-IDF y entrenamos un clasificador de Regresión Logística como punto de partida. Como explican Jurafsky y Martin (2024), esta combinación da buena precisión con pocos datos, es rápida y permite explicar qué palabras pesaron más en la decisión, lo cual es fundamental para sistemas que requieren transparencia. La compararemos con Naive Bayes; si no alcanzamos la meta, probaremos un Perceptrón Multicapa (MLP) pequeño como mejora gradual.

Para la extracción de información clave, completaremos los datos necesarios del diálogo (por ejemplo, OBJETO, LUGAR, ACCIÓN, COMIDA/BEBIDA) usando listas de vocabulario controladas, lematización (llevar cada palabra a su forma base) y expresiones regulares para patrones frecuentes. Bird et al. (2009) demuestran que la lematización mediante herramientas como NLTK permite reducir las palabras a su forma base de manera efectiva, facilitando el procesamiento posterior del texto. Es una solución simple y robusta que evita modelos de entidades más pesados y mantiene coherencia con el lenguaje del dominio.

Para el mapeo de texto a pictogramas, usaremos un diccionario normalizado que relaciona cada término con su ID de pictograma. Si no hay coincidencia exacta, compararemos la frase del usuario con descripciones breves de los pictogramas mediante similitud del coseno sobre TF-IDF. Manning et al. (2008) señalan que la similitud del coseno es especialmente adecuada para comparar documentos de texto ya que normaliza por la longitud del documento y se enfoca en la orientación de los vectores, permitiendo identificar similitudes semánticas independientemente del tamaño del texto. Mostraremos un top-3 de opciones, cubriendo así sinónimos y variantes de redacción de forma auditable.

### *Redes neuronales: Perceptrón / MLP (Backpropagation) — mejora gradual*
Si el modelo base no llega a la calidad esperada, incorporaremos un MLP de una sola capa oculta para mejorar el rendimiento sin perder rapidez. Rumelhart et al. (1986) introdujeron el algoritmo de backpropagation que permite entrenar redes neuronales multicapa de manera eficiente mediante la propagación hacia atrás del error, facilitando el aprendizaje de representaciones no lineales. Esta decisión se tomará sólo si los resultados medidos lo justifican.

---

### *Criterios de Aceptación (Métricas)*
- *Intenciones:* Macro-F1 ≥ 0.80 (se reportará también Accuracy).
- *Pictogramas:* Prec@1 ≥ 70% y Prec@3 ≥ 90%.
- *Diálogo (FSM):* ≥ 85 % de conversaciones completadas y 3–5 pasos de media por objetivo.
- *Rendimiento:* tiempo p95 por turno < 500 ms en ejecución local.

