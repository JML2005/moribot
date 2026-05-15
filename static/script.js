const input = document.querySelector("input");
const button = document.querySelector("button");
const chatBox = document.querySelector(".chat-box");

button.addEventListener("click", sendMessage);

function sendMessage() {

    const message = input.value;

    if(message.trim() === "") {
        return;
    }

    // Mensaje usuario

    const userMessage = document.createElement("div");
    userMessage.classList.add("message");
    userMessage.style.backgroundColor = "#2563eb";
    userMessage.style.color = "white";
    userMessage.style.marginLeft = "auto";
    userMessage.innerText = message;

    chatBox.appendChild(userMessage);

    // Respuesta bot
    
    setTimeout(() => {

        const botMessage = document.createElement("div");
        botMessage.classList.add("message");
        botMessage.classList.add("bot-message");

        botMessage.innerText = generateResponse(message);

        chatBox.appendChild(botMessage);

        chatBox.scrollTop = chatBox.scrollHeight;

    }, 500);

    input.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;
}

function generateResponse(message) {

    message = message.toLowerCase();

    if(message.includes("hola")) {
        return "Hola, encantado de hablar contigo.";
    }

    if(message.includes("nombre")) {
        return "Mi nombre es Moribot.";
    }

    if(message.includes("adios")) {
        return "Hasta luego. Espero verte pronto.";
    }

    return "Lo siento, todavía estoy aprendiendo.";
}