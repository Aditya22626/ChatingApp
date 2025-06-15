// DOM Elements
const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("chat-screen");
const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username-input");

const chatBox = document.getElementById("chat-box");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

let socket;
let username = "";

// Join button logic
joinBtn.addEventListener("click", () => {
  const input = usernameInput.value.trim();
  if (input) {
    username = input;
    loginScreen.classList.add("hidden");
    chatScreen.classList.remove("hidden");
    initWebSocket();
  }
});

// Connect to WebSocket
function initWebSocket() {
  socket = new WebSocket("wss://chatingapp-1-6x79.onrender.com"); // <-- Replace with your backend URL

  socket.onopen = () => {
    console.log("✅ Connected to WebSocket server");
    appendSystemMessage("✅ Connected to chat");
    messageInput.focus();
  };

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

  socket.onerror = (err) => {
    console.error("❌ WebSocket error:", err);
    appendSystemMessage("❌ Connection error.");
  };
}

// Handle message sending
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (text && socket && socket.readyState === WebSocket.OPEN) {
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

// Append system messages (like join/leave or error)
function appendSystemMessage(text) {
  const msgElem = document.createElement("div");
  msgElem.className = "system-message";
  msgElem.textContent = text;
  msgElem.style.color = "#888";
  msgElem.style.fontStyle = "italic";
  chatBox.appendChild(msgElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}
