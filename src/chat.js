const socket = io();

const username = prompt("Enter your username:");
socket.emit("signin", username);

const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message");
const messagesContainer = document.getElementById("messages");

// Get the messages
fetch("/messages")
    .then(response => response.json())
    .then(messages => {
        // Append previously sent messages to the chat
        messages.forEach((message) => {
            const messageElement = document.createElement("div");
            messageElement.innerText = `${message.username}: ${message.message}`;
            messagesContainer.appendChild(messageElement);
        });
    })
    .catch(error => console.log(`Error getting messages: ${error}`));



messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = messageInput.value;
    socket.emit("message", { username, message });
    messageInput.value = "";
});

socket.on("message", ({ username, message }) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = `${username}: ${message}`;
    messagesContainer.appendChild(messageElement);
    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});
