const input = document.querySelector("input");
const button = document.querySelector(".send-button");
const chatBox = document.querySelector(".chat-box");

// Sonido mensaje

const messageSound = new Audio("/static/sounds/message.mp3");

button.addEventListener("click", sendMessage);

// Enviar con ENTER

input.addEventListener("keypress", function(event) {

    if(event.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {

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

    input.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;

    // Mensaje escribiendo...

    const typingMessage = document.createElement("div");

    typingMessage.classList.add("message");
    typingMessage.classList.add("bot-message");

    typingMessage.innerText = "Moribot está escribiendo.";

    chatBox.appendChild(typingMessage);

    chatBox.scrollTop = chatBox.scrollHeight;

    // Animación puntitos

    let dots = 1;

    const typingAnimation = setInterval(() => {

        dots++;

        if(dots > 3) {
            dots = 1;
        }

        typingMessage.innerText =
            "Moribot está escribiendo" + ".".repeat(dots);

    }, 400);

    // Enviar mensaje al backend

    const response = await fetch("/chat", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            message: message
        })
    });

    const data = await response.json();

    // Espera artificial

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Detener animación

    clearInterval(typingAnimation);

    // Eliminar mensaje escribiendo...

    typingMessage.remove();

    // Reproducir sonido

    messageSound.play();

    // Respuesta bot

    const botMessage = document.createElement("div");

    botMessage.classList.add("message");
    botMessage.classList.add("bot-message");

    botMessage.innerText = data.response;

    chatBox.appendChild(botMessage);

    chatBox.scrollTop = chatBox.scrollHeight;
}

async function clearHistory() {

    await fetch("/clear", {
        method: "POST"
    });

    location.reload();
}