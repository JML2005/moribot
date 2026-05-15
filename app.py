from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

# Crear base de datos

def init_db():

    connection = sqlite3.connect("database/chatbot.db")

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_message TEXT,
            bot_response TEXT
        )
    """)

    connection.commit()
    connection.close()

# Generar respuesta

def generate_response(message):

    message = message.lower()

    # Memoria del nombre

    if "como me llamo" in message:

        connection = sqlite3.connect("database/chatbot.db")
        cursor = connection.cursor()

        cursor.execute("""
            SELECT user_message
            FROM conversations
            WHERE user_message LIKE 'me llamo%'
            ORDER BY id DESC
            LIMIT 1
        """)

        result = cursor.fetchone()

        connection.close()

        if result:
            name = result[0].replace("me llamo", "").strip()
            return f"Tu nombre es {name}."
        else:
            return "Todavía no me has dicho tu nombre."

    # Guardar nombre

    if "me llamo" in message:
        name = message.replace("me llamo", "").strip()
        return f"Encantado, {name}."

    # Saludos

    if "hola" in message:
        return "Hola, encantado de hablar contigo."

    if "buenas" in message:
        return "Buenas, ¿cómo estás hoy?"

    # Nombre del bot

    if "nombre" in message:
        return "Mi nombre es Moribot."

    # Hora actual

    if "hora" in message:

        current_time = datetime.now().strftime("%H:%M")

        return f"La hora actual es {current_time}."

    # Fecha actual

    if "fecha" in message or "dia" in message:

        current_date = datetime.now().strftime("%d/%m/%Y")

        return f"Hoy es {current_date}."

    # Estado emocional

    if "como estas" in message or "qué tal" in message:
        return "Estoy funcionando perfectamente y listo para ayudarte."

    # Agradecimientos

    if "gracias" in message:
        return "De nada. Estoy aquí para ayudarte."

    # Ayuda

    if "ayuda" in message:
        return "Puedo responder saludos, recordar tu nombre, decir la hora y mucho más."

    # Capacidades

    if "que puedes hacer" in message:
        return "Puedo mantener conversaciones, recordar información y guardar historial."

    # Despedida

    if "adios" in message:
        return "Hasta luego. Espero verte pronto."

    # Respuesta por defecto

    return "Lo siento, todavía estoy aprendiendo."

# Página principal

@app.route("/")
def home():

    connection = sqlite3.connect("database/chatbot.db")

    cursor = connection.cursor()

    cursor.execute("""
        SELECT user_message, bot_response
        FROM conversations
    """)

    conversations = cursor.fetchall()

    connection.close()

    return render_template(
        "index.html",
        conversations=conversations
    )

# Borrar historial

@app.route("/clear", methods=["POST"])
def clear_history():

    connection = sqlite3.connect("database/chatbot.db")

    cursor = connection.cursor()

    cursor.execute("DELETE FROM conversations")

    connection.commit()
    connection.close()

    return jsonify({
        "status": "success"
    })

# Ruta del chat

@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data["message"]

    bot_response = generate_response(user_message)

    # Guardar conversación

    connection = sqlite3.connect("database/chatbot.db")

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO conversations (user_message, bot_response)
        VALUES (?, ?)
    """, (user_message, bot_response))

    connection.commit()
    connection.close()

    return jsonify({
        "response": bot_response
    })

if __name__ == "__main__":
    init_db()
    app.run(debug=True)