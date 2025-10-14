// 游戏数据模型（MongoDB）
const mongoose = require('mongoose');
const { getGameTypeKeys } = require('../config/gameTypes');

const GameSchema = new mongoose.Schema({
  // 游戏唯一ID
  gameId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // 房间ID
  roomId: {
    type: String,
    required: true,
    index: true
  },
  
  // 游戏状态
  status: {
    type: String,
    enum: ['playing', 'finished'],
    default: 'playing'
  },
  
  // 游戏类型（板子配置）
  gameType: {
    type: String,
    required: true,
    enum: getGameTypeKeys()  // 从配置文件中动态获取所有板子类型
  },
  
  // 玩家角色列表
  roles: [{
    userId: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    alive: {
      type: Boolean,
      default: true
    }
  }],
  
  // 胜利阵营
  winner: {
    type: String,
    default: null
  },
  
  // 开始时间
  startedAt: {
    type: Date,
    default: Date.now
  },
  
  // 结束时间
  finishedAt: {
    type: Date,
    default: null
  }
}, {
  collection: 'games'
});

module.exports = mongoose.model('Game', GameSchema);

