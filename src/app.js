const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const fs = require("fs");

// Read messages from the JSON file
let messages = [];
try {
  messages = JSON.parse(fs.readFileSync("./messages.json"));
} catch (err) {
  console.log(`Error reading messages from file: ${err}`);
}

app.use(express.static(__dirname + "/"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("signin", (username) => {
    socket.username = username;
    socket.join("chat");
    socket.emit("signin");
  });

  socket.on("message", (data) => {
    if (!socket.username) return;
    console.log(`Received message from ${socket.username}: ${data.message}`);
    let message = { username: socket.username, message: data.message };
    io.to("chat").emit("message", message);

    // Add new message to messages array and write to JSON file
    messages.push(message);
    fs.writeFile("./messages.json", JSON.stringify(messages), (err) => {
      if (err) {
        console.log(`Error writing to messages.json: ${err}`);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.username} disconnected`);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/index.html");
});

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/html/chat.html");
});

app.get("/messages", (req, res) => {
  let messages = [];
  try {
    messages = JSON.parse(fs.readFileSync("./messages.json"));
  } catch (err) {
    console.log(`Error reading messages from file: ${err}`);
  }
  res.json(messages);
});


server.listen(80, () => {
  console.log("Server listening on port 80");
});
