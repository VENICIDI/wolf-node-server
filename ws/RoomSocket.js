import RoomService from '../services/RoomService.js';

const roomService = new RoomService();

export default function registerRoomEvents(io, socket) {

  // 加入房间
  socket.on('joinRoom', async ({ userId, roomCode }, callback) => {
    try {
      const room = await roomService.joinRoom(userId, roomCode);
      socket.join(room.roomId);
      io.to(room.roomId).emit('playerJoined', { userId, players: room.players });
      callback({ success: true, data: room });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

  // 离开房间
  socket.on('leaveRoom', async ({ userId, roomCode }) => {
    try {
      const room = await roomService.leaveRoom(userId, roomCode);
      socket.leave(room.roomId);
      io.to(room.roomId).emit('playerLeft', { userId, players: room.players });
    } catch (err) {
      console.error(err);
    }
  });
}