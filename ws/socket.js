import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import registerRoomEvents from './RoomSocket';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('用户连接', socket.id);

  // 注册房间ws
  registerRoomEvents(io, socket);

  socket.on('disconnect', () => {
    console.log(`用户断开: ${socket.id}`);
  });
  
});

server.listen(3000, () => console.log('Server running on port 3000'));