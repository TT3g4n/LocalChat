const socket = io();

document.getElementById("signin-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = event.target.elements.username.value;
  socket.emit("signin", username);
});

socket.on("signin", () => {
  window.location.href = "/chat";
});
