// 游戏事件类型枚举
const GameEventType = {
  // 游戏生命周期
  GAME_START: 'game_start',           // 游戏开始
  GAME_END: 'game_end',               // 游戏结束
  PHASE_CHANGE: 'phase_change',       // 阶段切换

  // 夜晚角色行动
  WEREWOLF_KILL: 'werewolf_kill',     // 狼人击杀
  WITCH_HEAL: 'witch_heal',           // 女巫用解药
  WITCH_POISON: 'witch_poison',       // 女巫用毒药
  SEER_CHECK: 'seer_check',           // 预言家查验
  GUARD_PROTECT: 'guard_protect',     // 守卫守护
  DREAM_WITCH: 'dream_witch',         // 摄梦人偷技能

  // 白天事件
  ANNOUNCE_DEATHS: 'announce_deaths', // 公布死亡名单
  SPEECH: 'speech',                   // 发言
  VOTE: 'vote',                       // 投票（白天放逐/警长投票）
  BANISH: 'banish',                   // 放逐执行
  SHERIFF_ELECTION: 'sheriff_election', // 警长竞选投票
  SHERIFF_TRANSFER: 'sheriff_transfer', // 警徽移交
  HUNTER_SHOOT: 'hunter_shoot',       // 猎人开枪

  // 特殊角色/技能
  WHITE_WOLF_KILL: 'white_wolf_kill', // 白狼王夜晚杀人
  BEAR_GROWL: 'bear_growl',           // 熊的技能（隔夜死亡）
  CUPID_BIND: 'cupid_bind',           // 丘比特配对
  LOVERS_DEATH: 'lovers_death',       // 情侣连死
  IDIOT_REVEAL: 'idiot_reveal',       // 白痴亮身份

  // 自定义/系统事件
  CUSTOM: 'custom'                    // 自定义事件（未来扩展）
};

// 事件类型详细信息配置
const GameEventTypeConfig = {
  // 游戏生命周期
  [GameEventType.GAME_START]: {
    key: GameEventType.GAME_START,
    name: '游戏开始',
    category: 'lifecycle',
    description: '游戏正式开始'
  },
  [GameEventType.GAME_END]: {
    key: GameEventType.GAME_END,
    name: '游戏结束',
    category: 'lifecycle',
    description: '游戏结束，宣布胜利方'
  },
  [GameEventType.PHASE_CHANGE]: {
    key: GameEventType.PHASE_CHANGE,
    name: '阶段切换',
    category: 'lifecycle',
    description: '游戏阶段切换（白天/黑夜）'
  },

  // 夜晚角色行动
  [GameEventType.WEREWOLF_KILL]: {
    key: GameEventType.WEREWOLF_KILL,
    name: '狼人击杀',
    category: 'night_action',
    description: '狼人在夜晚选择击杀目标'
  },
  [GameEventType.WITCH_HEAL]: {
    key: GameEventType.WITCH_HEAL,
    name: '女巫使用解药',
    category: 'night_action',
    description: '女巫使用解药救人'
  },
  [GameEventType.WITCH_POISON]: {
    key: GameEventType.WITCH_POISON,
    name: '女巫使用毒药',
    category: 'night_action',
    description: '女巫使用毒药毒人'
  },
  [GameEventType.SEER_CHECK]: {
    key: GameEventType.SEER_CHECK,
    name: '预言家查验',
    category: 'night_action',
    description: '预言家查验玩家身份'
  },
  [GameEventType.GUARD_PROTECT]: {
    key: GameEventType.GUARD_PROTECT,
    name: '守卫守护',
    category: 'night_action',
    description: '守卫守护玩家'
  },
  [GameEventType.DREAM_WITCH]: {
    key: GameEventType.DREAM_WITCH,
    name: '摄梦人偷技能',
    category: 'night_action',
    description: '摄梦人偷取技能'
  },

  // 白天事件
  [GameEventType.ANNOUNCE_DEATHS]: {
    key: GameEventType.ANNOUNCE_DEATHS,
    name: '公布死亡名单',
    category: 'day_event',
    description: '公布夜晚死亡的玩家'
  },
  [GameEventType.SPEECH]: {
    key: GameEventType.SPEECH,
    name: '发言',
    category: 'day_event',
    description: '玩家发言阶段'
  },
  [GameEventType.VOTE]: {
    key: GameEventType.VOTE,
    name: '投票',
    category: 'day_event',
    description: '玩家投票（放逐/警长）'
  },
  [GameEventType.BANISH]: {
    key: GameEventType.BANISH,
    name: '放逐执行',
    category: 'day_event',
    description: '执行放逐投票结果'
  },
  [GameEventType.SHERIFF_ELECTION]: {
    key: GameEventType.SHERIFF_ELECTION,
    name: '警长竞选',
    category: 'day_event',
    description: '警长竞选投票'
  },
  [GameEventType.SHERIFF_TRANSFER]: {
    key: GameEventType.SHERIFF_TRANSFER,
    name: '警徽移交',
    category: 'day_event',
    description: '警长死亡后移交警徽'
  },
  [GameEventType.HUNTER_SHOOT]: {
    key: GameEventType.HUNTER_SHOOT,
    name: '猎人开枪',
    category: 'day_event',
    description: '猎人死亡后开枪带走一人'
  },

  // 特殊角色/技能
  [GameEventType.WHITE_WOLF_KILL]: {
    key: GameEventType.WHITE_WOLF_KILL,
    name: '白狼王击杀',
    category: 'special',
    description: '白狼王夜晚额外击杀'
  },
  [GameEventType.BEAR_GROWL]: {
    key: GameEventType.BEAR_GROWL,
    name: '熊咆哮',
    category: 'special',
    description: '熊的技能（隔夜死亡）'
  },
  [GameEventType.CUPID_BIND]: {
    key: GameEventType.CUPID_BIND,
    name: '丘比特配对',
    category: 'special',
    description: '丘比特绑定情侣'
  },
  [GameEventType.LOVERS_DEATH]: {
    key: GameEventType.LOVERS_DEATH,
    name: '情侣连死',
    category: 'special',
    description: '情侣一方死亡，另一方殉情'
  },
  [GameEventType.IDIOT_REVEAL]: {
    key: GameEventType.IDIOT_REVEAL,
    name: '白痴亮身份',
    category: 'special',
    description: '白痴被放逐时亮明身份'
  },

  // 自定义/系统事件
  [GameEventType.CUSTOM]: {
    key: GameEventType.CUSTOM,
    name: '自定义事件',
    category: 'custom',
    description: '自定义事件（未来扩展）'
  }
};

// 获取所有事件类型的值列表
const getGameEventTypeValues = () => {
  return Object.values(GameEventType);
};

// 根据key获取事件配置
const getGameEventTypeConfig = (eventType) => {
  return GameEventTypeConfig[eventType] || null;
};

// 根据分类获取事件类型
const getGameEventTypesByCategory = (category) => {
  return Object.values(GameEventTypeConfig).filter(
    config => config.category === category
  );
};

// 验证事件类型是否有效
const isValidGameEventType = (eventType) => {
  return Object.values(GameEventType).includes(eventType);
};

module.exports = {
  GameEventType,
  GameEventTypeConfig,
  getGameEventTypeValues,
  getGameEventTypeConfig,
  getGameEventTypesByCategory,
  isValidGameEventType
};

