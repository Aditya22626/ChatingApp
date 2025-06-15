const username = prompt("Enter your name:");
const socket = new WebSocket("wss://YOUR-BACKEND.onrender.com");

// DOM elements
const chatBox = document.getElementById("chat-box");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

socket.onopen = () => {
  console.log("✅ Connected to WebSocket server");
};

socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === "message") {
    appendMessage(msg.from, msg.text);
  }
};

socket.onerror = (err) => {
  console.error("❌ WebSocket error:", err);
};

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (text) {
    socket.send(JSON.stringify({
      type: "message",
      from: username,
      text: text
    }));
    messageInput.value = "";
  }
});

function appendMessage(from, text) {
  const msgElem = document.createElement("div");
  msgElem.className = "message";
  msgElem.innerHTML = `<strong>${from}:</strong> ${text}`;
  chatBox.appendChild(msgElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}
