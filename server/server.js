const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Optional: Serve static files if frontend is also hosted here
app.use(express.static(path.join(__dirname, '../client')));

wss.on('connection', (ws) => {
  console.log("✅ Client connected");

  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    console.log("📩 Message received:", msg);

    // Broadcast to all other clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: "message",
          from: msg.from,
          text: msg.text
        }));
      }
    });
  });

  ws.on('close', () => {
    console.log("❌ Client disconnected");
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});
