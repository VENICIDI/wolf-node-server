// 房间数据模型（MongoDB）
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  // 房间ID
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // 房主用户ID
  ownerUserId: {
    type: String,
    required: true,
    index: true
  },
  
  // 房间状态
  status: {
    type: String,
    required: true,
    enum: ['waiting', 'playing'],
    default: 'waiting'
  },
  
  // 玩家列表
  players: [{
    userId: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    ready: {
      type: Boolean,
      default: false
    }
  }],
  
  // 当前游戏ID
  currentGameId: {
    type: String,
    default: null
  },
  
  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  collection: 'rooms'
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
