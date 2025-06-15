const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const users = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const msg = JSON.parse(data);

    switch (msg.type) {
      case 'login':
        users.set(ws, msg.username);
        broadcast(JSON.stringify({ type: 'userList', users: Array.from(users.values()) }));
        break;
      case 'message':
        broadcast(JSON.stringify({ type: 'message', from: msg.from, text: msg.text }));
        break;
    }
  });

  ws.on('close', () => {
    users.delete(ws);
    broadcast(JSON.stringify({ type: 'userList', users: Array.from(users.values()) }));
  });
});

function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Serve frontend files
app.use(express.static(path.join(__dirname, '../client')));

// Start the server
server.listen(process.env.PORT || 10000, '0.0.0.0', () => {
  console.log(`Server listening on port ${process.env.PORT || 10000}`);
});

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const msg = JSON.parse(data);

    if (msg.type === 'message') {
      // Broadcast message to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'message', from: msg.from, text: msg.text }));
        }
      });
    }
  });
});
