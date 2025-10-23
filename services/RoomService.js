import { customAlphabet } from 'nanoid';
import Room from '../models/Room';

const nanoid4 = customAlphabet('0123456789', 4);
export default class RoomService {

  async createRoom(userId) {
    let code;
    let exists = true;
    while (exists) {
      code = nanoid4();
      exists = await Room.exists({ roomCode: code, status: { $ne: 'closed' } });
    }

    const room = await Room.create({
      roomCode: code,
      ownerUserId: userId,
      status: 'waiting',
      players: [{
        userId: userId,
        ready: true
      }]
    });

    return {
        ...room.toObject(),
        roomId: room._id.toString()
    };
  }

  async joinRoom(userId, roomCode) {
    const room = await Room.findOne({ roomCode, status: { $ne: 'closed' } });
    if (!room) {
      throw new Error('房间不存在');
    }
    if (room.players.length === 12 ) {
      throw new Error('房间已满');
    }
    if (room.players.some(player => player.userId === userId)) {
      throw new Error('你已经在这个房间了');
    }
    room.players.push({ userId: userId, ready: true });

    // 保存至db
    await room.save();
    
    // 返回新的房间信息
    return {
        ...room.toObject(),
        roomId: room._id.toString()
    };
  }

  async leaveRoom(userId, roomCode) {
    const room = await Room.findOne({ roomCode, status: { $ne: 'closed' } });
    if (!room) {
      throw new Error('房间不存在');
    }
    room.players = room.players.filter(player => player.userId !== userId);

    if (room.players.length === 0) {
      room.status = 'closed';
    }

    await room.save();
    return {
      ...room.toObject(),
      roomId: room._id.toString()
    };
  }
}