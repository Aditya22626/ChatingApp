// Prompt for username
let username = "";
while (!username) {
  username = prompt("Enter your name:").trim();
}

// Connect to your WebSocket server
const socket = new WebSocket("wss://YOUR-BACKEND.onrender.com");

// DOM Elements
const chatBox = document.getElementById("chat-box");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

// Handle connection open
socket.onopen = () => {
  console.log("✅ Connected to WebSocket server");
  appendSystemMessage("✅ Connected to chat");
  messageInput.focus();
};

// Handle incoming messages
socket.onmessage = (event) => {
  try {
    const msg = JSON.parse(event.data);
    if (msg.type === "message") {
      appendMessage(msg.from, msg.text);
    } else if (msg.type === "system") {
      appendSystemMessage(msg.text);
    }
  } catch (err) {
    console.error("Error parsing message:", err);
  }
};

// Handle errors
socket.onerror = (err) => {
  console.error("❌ WebSocket error:", err);
  appendSystemMessage("❌ Connection error.");
};

// Send messages
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (text && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: "message",
      from: username,
      text: text
    }));
    messageInput.value = "";
  }
});

// Append user message
function appendMessage(from, text) {
  const msgElem = document.createElement("div");
  msgElem.className = "message";
  msgElem.innerHTML = `<strong>${from}:</strong> ${text}`;
  chatBox.appendChild(msgElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Append system messages (like errors or status)
function appendSystemMessage(text) {
  const msgElem = document.createElement("div");
  msgElem.className = "system-message";
  msgElem.textContent = text;
  msgElem.style.color = "#888";
  msgElem.style.fontStyle = "italic";
  chatBox.appendChild(msgElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}
