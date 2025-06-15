
let socket;
let username;

function login() {
  username = document.getElementById('username').value;
  if (!username) return alert('Please enter a username');

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('chat-screen').classList.remove('hidden');

const socket = new WebSocket('wss://chatingapp-4lq1.onrender.com
  socket.onopen = () => {
    socket.send(JSON.stringify({ type: 'login', username }));
  };

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    switch (msg.type) {
      case 'userList':
        updateUserList(msg.users);
        break;
      case 'message':
        addMessage(msg.from, msg.text);
        break;
    }
  };
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value;
  if (!text) return;

  socket.send(JSON.stringify({ type: 'message', from: username, text }));
  input.value = '';
}

function addMessage(from, text) {
  const div = document.createElement('div');
  div.textContent = `${from}: ${text}`;
  document.getElementById('chat-window').appendChild(div);
}

function updateUserList(users) {
  const list = document.getElementById('user-list');
  list.innerHTML = '<b>Online:</b><br>' + users.map(u => `<div>${u}</div>`).join('');
}
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
// your app.use, endpoints, static file serve...

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => { /* ... */ });

server.listen(process.env.PORT || 10000, '0.0.0.0');
