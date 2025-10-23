# WebSocket 架构设计文档

## 设计理念

采用**命令模式 + 事件驱动架构**，将所有操作抽象为统一的接口，通过 `action` 类型区分不同操作。

---

## 核心接口设计

### 客户端 → 服务端：统一操作入口

只需要 **2个核心接口**：

#### 1. roomAction - 房间操作
```javascript
socket.emit('roomAction', {
  action: 'join_room',      // 操作类型
  userId: 'xxx',            // 操作者ID
  data: {                   // 操作数据
    roomCode: '1234'
  }
}, (response) => {
  // 统一响应格式
  // { success: true/false, data: {...}, message: 'xxx' }
});
```

#### 2. gameAction - 游戏操作
```javascript
socket.emit('gameAction', {
  action: 'werewolf_kill',  // 操作类型
  gameId: 'xxx',            // 游戏ID
  userId: 'xxx',            // 操作者ID
  data: {                   // 操作数据
    targetUserId: 'xxx'
  }
}, (response) => {
  // 统一响应格式
  // { success: true/false, data: {...}, message: 'xxx' }
});
```

### 服务端 → 客户端：统一事件推送

只需要 **2个核心接口**：

#### 1. roomEvent - 房间事件
```javascript
socket.on('roomEvent', ({ 
  event: 'player_joined',   // 事件类型
  roomId: 'xxx',            // 房间ID
  data: {                   // 事件数据
    userId: 'xxx',
    players: [...]
  },
  timestamp: 1234567890
}) => {
  // 统一处理房间事件
});
```

#### 2. gameEvent - 游戏事件
```javascript
socket.on('gameEvent', ({ 
  event: 'phase_changed',   // 事件类型
  gameId: 'xxx',            // 游戏ID
  data: {                   // 事件数据
    phase: 'night',
    currentRole: 'werewolf'
  },
  timestamp: 1234567890,
  private: false            // 是否私有消息
}) => {
  // 统一处理游戏事件
});
```

---

## Action 类型定义

### RoomAction 类型枚举

```javascript
const RoomActionType = {
  // 房间基础操作
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  GET_ROOM_INFO: 'get_room_info',
  
  // 房间设置
  TOGGLE_READY: 'toggle_ready',
  UPDATE_SETTINGS: 'update_settings',
  
  // 游戏控制
  START_GAME: 'start_game',
  
  // 聊天
  SEND_MESSAGE: 'send_message'
};
```

### GameAction 类型枚举

```javascript
const GameActionType = {
  // 游戏状态查询
  GET_GAME_STATE: 'get_game_state',
  GET_MY_ROLE: 'get_my_role',
  
  // 夜晚行动
  WEREWOLF_KILL: 'werewolf_kill',
  WITCH_HEAL: 'witch_heal',
  WITCH_POISON: 'witch_poison',
  SEER_CHECK: 'seer_check',
  GUARD_PROTECT: 'guard_protect',
  
  // 白天行动
  SPEECH: 'speech',
  VOTE: 'vote',
  SHERIFF_RUN: 'sheriff_run',
  SHERIFF_TRANSFER: 'sheriff_transfer',
  HUNTER_SHOOT: 'hunter_shoot',
  
  // 特殊操作
  SKIP_ACTION: 'skip_action'  // 跳过当前行动
};
```

---

## Event 类型定义

### RoomEvent 类型枚举

```javascript
const RoomEventType = {
  // 玩家变动
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  PLAYER_READY_CHANGED: 'player_ready_changed',
  PLAYER_DISCONNECTED: 'player_disconnected',
  PLAYER_RECONNECTED: 'player_reconnected',
  
  // 房间状态
  ROOM_SETTINGS_UPDATED: 'room_settings_updated',
  ROOM_CLOSED: 'room_closed',
  
  // 聊天消息
  NEW_MESSAGE: 'new_message',
  
  // 错误通知
  ERROR: 'error'
};
```

### GameEvent 类型枚举

```javascript
const GameEventType = {
  // 游戏生命周期
  GAME_STARTED: 'game_started',
  GAME_ENDED: 'game_ended',
  PHASE_CHANGED: 'phase_changed',
  
  // 角色信息（私有）
  ROLE_ASSIGNED: 'role_assigned',
  
  // 夜晚事件
  NIGHT_ACTION_WAITING: 'night_action_waiting',     // 等待某角色行动
  NIGHT_ACTION_COMPLETED: 'night_action_completed', // 某角色行动完成
  WEREWOLF_VOTING: 'werewolf_voting',               // 狼人投票中（仅狼人）
  SEER_RESULT: 'seer_result',                       // 预言家结果（私有）
  
  // 白天事件
  DEATH_ANNOUNCED: 'death_announced',
  SPEECH_TURN: 'speech_turn',
  PLAYER_SPEAKING: 'player_speaking',
  VOTING_STARTED: 'voting_started',
  VOTE_UPDATE: 'vote_update',
  VOTE_RESULT: 'vote_result',
  PLAYER_EXILED: 'player_exiled',
  
  // 警长相关
  SHERIFF_ELECTED: 'sheriff_elected',
  SHERIFF_TRANSFERRED: 'sheriff_transferred',
  
  // 特殊事件
  HUNTER_ACTIVATED: 'hunter_activated',
  IDIOT_REVEALED: 'idiot_revealed',
  LOVERS_LINKED: 'lovers_linked',
  
  // 错误
  ERROR: 'error'
};
```

---

## 统一响应格式

所有 callback 响应都遵循统一格式：

```javascript
{
  success: true/false,      // 操作是否成功
  data: { ... },           // 返回数据
  message: 'xxx',          // 提示信息
  code: 'ERROR_CODE'       // 错误码（失败时）
}
```

---

## 服务端实现架构

### 1. Action Handler 基类

```javascript
// handlers/BaseActionHandler.js
class BaseActionHandler {
  constructor(io, services) {
    this.io = io;
    this.services = services;
  }
  
  // 验证权限
  async validate(payload) {
    throw new Error('Must implement validate method');
  }
  
  // 执行操作
  async execute(payload) {
    throw new Error('Must implement execute method');
  }
  
  // 处理入口
  async handle(payload) {
    try {
      // 验证
      await this.validate(payload);
      
      // 执行
      const result = await this.execute(payload);
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      };
    }
  }
}

module.exports = BaseActionHandler;
```

### 2. 具体 Handler 实现示例

```javascript
// handlers/room/JoinRoomHandler.js
const BaseActionHandler = require('../BaseActionHandler');

class JoinRoomHandler extends BaseActionHandler {
  async validate(payload) {
    const { userId, data } = payload;
    if (!userId) throw new Error('userId is required');
    if (!data.roomCode) throw new Error('roomCode is required');
  }
  
  async execute(payload) {
    const { userId, data } = payload;
    const room = await this.services.roomService.joinRoom(userId, data.roomCode);
    
    // 广播事件
    this.io.to(room.roomId).emit('roomEvent', {
      event: 'player_joined',
      roomId: room.roomId,
      data: {
        userId,
        players: room.players
      },
      timestamp: Date.now()
    });
    
    return room;
  }
}

module.exports = JoinRoomHandler;
```

```javascript
// handlers/game/WerewolfKillHandler.js
const BaseActionHandler = require('../BaseActionHandler');

class WerewolfKillHandler extends BaseActionHandler {
  async validate(payload) {
    const { gameId, userId, data } = payload;
    
    // 验证参数
    if (!gameId || !userId || !data.targetUserId) {
      throw new Error('Missing required parameters');
    }
    
    // 验证游戏状态
    const game = await this.services.gameService.getGame(gameId);
    if (game.phase !== 'night') {
      throw new Error('Not in night phase');
    }
    
    // 验证角色权限
    const player = game.roles.find(r => r.userId === userId);
    if (player.role !== 'werewolf') {
      throw new Error('Only werewolf can kill');
    }
  }
  
  async execute(payload) {
    const { gameId, userId, data } = payload;
    
    // 执行击杀逻辑
    const result = await this.services.gameService.werewolfKill(
      gameId, 
      userId, 
      data.targetUserId
    );
    
    // 广播给所有狼人
    const game = await this.services.gameService.getGame(gameId);
    const werewolves = game.roles.filter(r => r.role === 'werewolf');
    
    werewolves.forEach(wolf => {
      this.io.to(wolf.socketId).emit('gameEvent', {
        event: 'werewolf_voting',
        gameId,
        data: result.votes,
        timestamp: Date.now(),
        private: true
      });
    });
    
    return result;
  }
}

module.exports = WerewolfKillHandler;
```

### 3. Handler Registry（处理器注册表）

```javascript
// handlers/HandlerRegistry.js
const JoinRoomHandler = require('./room/JoinRoomHandler');
const CreateRoomHandler = require('./room/CreateRoomHandler');
const WerewolfKillHandler = require('./game/WerewolfKillHandler');
// ... 引入其他 handlers

class HandlerRegistry {
  constructor(io, services) {
    this.roomHandlers = {};
    this.gameHandlers = {};
    
    this.registerRoomHandlers(io, services);
    this.registerGameHandlers(io, services);
  }
  
  registerRoomHandlers(io, services) {
    this.roomHandlers['create_room'] = new CreateRoomHandler(io, services);
    this.roomHandlers['join_room'] = new JoinRoomHandler(io, services);
    this.roomHandlers['leave_room'] = new LeaveRoomHandler(io, services);
    this.roomHandlers['toggle_ready'] = new ToggleReadyHandler(io, services);
    this.roomHandlers['start_game'] = new StartGameHandler(io, services);
    // ... 注册其他 room handlers
  }
  
  registerGameHandlers(io, services) {
    this.gameHandlers['werewolf_kill'] = new WerewolfKillHandler(io, services);
    this.gameHandlers['seer_check'] = new SeerCheckHandler(io, services);
    this.gameHandlers['witch_heal'] = new WitchHealHandler(io, services);
    this.gameHandlers['vote'] = new VoteHandler(io, services);
    // ... 注册其他 game handlers
  }
  
  getRoomHandler(action) {
    const handler = this.roomHandlers[action];
    if (!handler) {
      throw new Error(`Unknown room action: ${action}`);
    }
    return handler;
  }
  
  getGameHandler(action) {
    const handler = this.gameHandlers[action];
    if (!handler) {
      throw new Error(`Unknown game action: ${action}`);
    }
    return handler;
  }
}

module.exports = HandlerRegistry;
```

### 4. Socket 主文件重构

```javascript
// ws/socket.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import HandlerRegistry from './handlers/HandlerRegistry.js';
import RoomService from './services/RoomService.js';
import GameService from './services/GameService.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// 初始化服务
const services = {
  roomService: new RoomService(io),
  gameService: new GameService(io)
};

// 初始化处理器注册表
const handlerRegistry = new HandlerRegistry(io, services);

io.on('connection', (socket) => {
  console.log('用户连接', socket.id);
  
  // 统一的房间操作入口
  socket.on('roomAction', async (payload, callback) => {
    try {
      const handler = handlerRegistry.getRoomHandler(payload.action);
      const result = await handler.handle(payload);
      callback(result);
    } catch (error) {
      callback({
        success: false,
        message: error.message,
        code: 'HANDLER_ERROR'
      });
    }
  });
  
  // 统一的游戏操作入口
  socket.on('gameAction', async (payload, callback) => {
    try {
      const handler = handlerRegistry.getGameHandler(payload.action);
      const result = await handler.handle(payload);
      callback(result);
    } catch (error) {
      callback({
        success: false,
        message: error.message,
        code: 'HANDLER_ERROR'
      });
    }
  });
  
  // 断开连接
  socket.on('disconnect', () => {
    console.log('用户断开', socket.id);
    // 可以在这里触发断线处理 handler
  });
});

server.listen(3000, () => console.log('Server running on port 3000'));
```

---

## 客户端使用示例

### 房间操作示例

```javascript
// 创建房间
socket.emit('roomAction', {
  action: 'create_room',
  userId: 'user123',
  data: {}
}, (response) => {
  if (response.success) {
    console.log('房间创建成功', response.data);
  } else {
    console.error('创建失败', response.message);
  }
});

// 加入房间
socket.emit('roomAction', {
  action: 'join_room',
  userId: 'user123',
  data: { roomCode: '1234' }
}, (response) => {
  if (response.success) {
    console.log('加入成功', response.data);
  }
});

// 准备
socket.emit('roomAction', {
  action: 'toggle_ready',
  userId: 'user123',
  data: { roomCode: '1234' }
}, (response) => {
  console.log(response);
});

// 开始游戏
socket.emit('roomAction', {
  action: 'start_game',
  userId: 'user123',
  data: { 
    roomCode: '1234',
    gameType: 'standard_9'
  }
}, (response) => {
  if (response.success) {
    console.log('游戏开始', response.data.gameId);
  }
});
```

### 游戏操作示例

```javascript
// 狼人击杀
socket.emit('gameAction', {
  action: 'werewolf_kill',
  gameId: 'game123',
  userId: 'user123',
  data: { targetUserId: 'user456' }
}, (response) => {
  if (response.success) {
    console.log('击杀成功');
  }
});

// 预言家查验
socket.emit('gameAction', {
  action: 'seer_check',
  gameId: 'game123',
  userId: 'user123',
  data: { targetUserId: 'user456' }
}, (response) => {
  if (response.success) {
    console.log('查验结果', response.data.result); // 'good' or 'bad'
  }
});

// 投票
socket.emit('gameAction', {
  action: 'vote',
  gameId: 'game123',
  userId: 'user123',
  data: { 
    targetUserId: 'user456',
    voteType: 'exile'
  }
}, (response) => {
  console.log('投票成功', response);
});
```

### 事件监听示例

```javascript
// 监听房间事件
socket.on('roomEvent', ({ event, roomId, data, timestamp }) => {
  switch(event) {
    case 'player_joined':
      console.log('新玩家加入', data.userId);
      updatePlayerList(data.players);
      break;
    case 'player_left':
      console.log('玩家离开', data.userId);
      updatePlayerList(data.players);
      break;
    case 'player_ready_changed':
      updatePlayerReady(data.userId, data.ready);
      break;
    case 'new_message':
      displayMessage(data.userId, data.message);
      break;
  }
});

// 监听游戏事件
socket.on('gameEvent', ({ event, gameId, data, timestamp, private: isPrivate }) => {
  switch(event) {
    case 'game_started':
      console.log('游戏开始');
      break;
      
    case 'role_assigned':
      // 私有消息：我的角色
      console.log('我的角色是', data.role);
      displayRole(data.role, data.teammates);
      break;
      
    case 'phase_changed':
      console.log('阶段切换', data.phase, data.currentRole);
      updatePhase(data.phase, data.day);
      break;
      
    case 'death_announced':
      console.log('昨夜死亡', data.deaths);
      updateDeaths(data.deaths);
      break;
      
    case 'voting_started':
      console.log('开始投票', data.voteType);
      showVotingUI(data.candidates);
      break;
      
    case 'vote_result':
      console.log('投票结果', data.result);
      displayVoteResult(data.votes);
      break;
      
    case 'game_ended':
      console.log('游戏结束', data.winner);
      showGameResult(data.winner, data.roles);
      break;
  }
});
```

---

## 架构优势

### ✅ 1. 高度统一
- 只有2个客户端发送接口（roomAction, gameAction）
- 只有2个服务端推送接口（roomEvent, gameEvent）
- 所有操作通过 action 类型区分

### ✅ 2. 易于扩展
- 新增功能只需添加新的 Handler 类
- 在 HandlerRegistry 中注册即可
- 不需要修改 socket.js 主文件

### ✅ 3. 职责清晰
- 每个 Handler 处理一种操作
- 验证逻辑、业务逻辑分离
- 便于单元测试

### ✅ 4. 统一错误处理
- 所有错误通过统一格式返回
- 便于客户端统一处理

### ✅ 5. 便于维护
- 代码结构清晰
- 易于定位问题
- 便于多人协作

---

## 目录结构

```
ws/
├── socket.js                    # 主入口
├── handlers/
│   ├── BaseActionHandler.js    # 基类
│   ├── HandlerRegistry.js      # 注册表
│   ├── room/                   # 房间操作处理器
│   │   ├── CreateRoomHandler.js
│   │   ├── JoinRoomHandler.js
│   │   ├── LeaveRoomHandler.js
│   │   ├── ToggleReadyHandler.js
│   │   ├── StartGameHandler.js
│   │   └── ...
│   └── game/                   # 游戏操作处理器
│       ├── WerewolfKillHandler.js
│       ├── SeerCheckHandler.js
│       ├── WitchHealHandler.js
│       ├── VoteHandler.js
│       └── ...
├── constants/
│   ├── RoomActionType.js       # 房间操作类型
│   ├── RoomEventType.js        # 房间事件类型
│   ├── GameActionType.js       # 游戏操作类型
│   └── GameEventType.js        # 游戏事件类型
└── middlewares/
    ├── validateSocket.js       # Socket 验证中间件
    └── authSocket.js           # Socket 认证中间件
```

---

## 下一步实现计划

1. ✅ 创建基础架构（BaseActionHandler, HandlerRegistry）
2. 🔲 实现房间相关 Handlers（P0 优先级）
3. 🔲 实现游戏流程 Handlers（P0 优先级）
4. 🔲 实现角色技能 Handlers（P1 优先级）
5. 🔲 添加中间件（认证、日志、限流等）
6. 🔲 编写单元测试
7. 🔲 性能优化和错误处理完善

---

生成时间：2025-10-23

