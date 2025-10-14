// 游戏日志数据模型（MongoDB）
const mongoose = require('mongoose');
const { getGameEventTypeValues } = require('../config/gameEventTypes');

const GameLogSchema = new mongoose.Schema({
  // 对应游戏表的唯一ID
  gameId: {
    type: String,
    required: true,
    index: true
  },
  
  // 操作类型（从配置文件中动态获取）
  eventType: {
    type: String,
    enum: getGameEventTypeValues(),
    required: true
  },
  
  // 游戏阶段
  phase: {
    type: String,
    enum: ['night', 'day', 'vote', 'sheriff_vote', 'sheriff_transfer_phase', 'start', 'end'],
    required: true
  },
  
  // 阶段内的执行顺序（根据 GameType 配置表）
  order: {
    type: Number,
    default: null
  },
  
  // 操作者（发起动作的玩家ID or 系统）
  actor: {
    type: String,
    required: false
  },
  
  // 被操作的对象（玩家ID，可空）
  target: {
    type: String,
    required: false
  },
  
  // 附加数据，结构灵活，如票数、查验结果等
  data: {
    type: Object,
    default: {}
  },
  
  // 事件发生时间
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  collection: 'gamelogs',
  versionKey: false  // 不生成 __v 字段
});

// 复合索引：根据gameId和createdAt查询日志
GameLogSchema.index({ gameId: 1, createdAt: 1 });

// 复合索引：根据gameId和phase查询特定阶段的日志
GameLogSchema.index({ gameId: 1, phase: 1 });

module.exports = mongoose.model('GameLog', GameLogSchema);

