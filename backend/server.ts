import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer, Socket } from 'socket.io';

import CONFIG from './config';

const app = express();
const httpServer = http.createServer(app);
const io = new IOServer(httpServer, {
  cors: { origin: '*' },
});

app.use(cors({ origin: '*' }));

const activeUsers = new Map<string, string>();
const messageHistory: { userId: string; message: string; createdAt: string }[] = [];

io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join', (username: string) => {
    if (!username || username.trim() === '') {
      return;
    }

    activeUsers.set(socket.id, username);
    console.log(`${username} joined the chat`);

    socket.emit('messageHistory', messageHistory);
    io.emit('updateUsers', Array.from(activeUsers.values()));
  });

  socket.on('typing', (userId: string) => {
    socket.broadcast.emit('typing', userId);
  });

  socket.on('stopTyping', (userId: string) => {
    socket.broadcast.emit('stopTyping', userId);
  });

  socket.on('message', (data: { userId: string; message: string }) => {
    if (!data.message.trim()) return;

    const timestamp = new Date().toISOString();
    const newMessage = { userId: data.userId, message: data.message, createdAt: timestamp };

    messageHistory.push(newMessage);
    if (messageHistory.length > 50) messageHistory.shift();

    io.emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    const username = activeUsers.get(socket.id);
    if (username) {
      console.log(`${username} disconnected`);
      activeUsers.delete(socket.id);
      io.emit('updateUsers', Array.from(activeUsers.values()));
    }
  });
});

httpServer.listen(CONFIG.PORT, () => {
  console.log(`Server listening on *:${CONFIG.PORT} 🚀`);
});
