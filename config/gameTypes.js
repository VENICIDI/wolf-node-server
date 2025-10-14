// 狼人杀游戏板子配置
const GameTypes = {
  standard_6: {
    key: 'standard_6',
    title: '6人标准局',
    description: '适合新手的6人快速局，包含基础角色',
    playerCount: 6,
    roles: {
      werewolf: 2,      // 狼人
      villager: 2,      // 平民
      seer: 1,          // 预言家
      witch: 1          // 女巫
    },
    phaseOrder: {
        night: [
          { order: 1, role: "werewolf", eventType: "kill" },
          { order: 2, role: "witch", eventType: "witch_heal" },
          { order: 3, role: "witch", eventType: "witch_poison" },
          { order: 4, role: "seer", eventType: "seer_check" }
        ],
        day: [
          { order: 1, eventType: "announce_deaths" },
          { order: 2, eventType: "speech" },
          { order: 3, eventType: "vote" },
          { order: 4, eventType: "banish" }
        ]
    }
  },
  
  standard_9: {
    key: 'standard_9',
    title: '9人标准局',
    description: '经典9人局，平衡的角色配置',
    playerCount: 9,
    roles: {
      werewolf: 3,      // 狼人
      villager: 3,      // 平民
      seer: 1,          // 预言家
      witch: 1,         // 女巫
      hunter: 1         // 猎人
    },
    phaseOrder: {
        night: [
          { order: 1, role: "werewolf", eventType: "kill" },
          { order: 2, role: "witch", eventType: "witch_heal" },
          { order: 3, role: "witch", eventType: "witch_poison" },
          { order: 4, role: "seer", eventType: "seer_check" }
        ],
        day: [
          { order: 1, eventType: "announce_deaths" },
          { order: 2, eventType: "speech" },
          { order: 3, eventType: "vote" },
          { order: 4, eventType: "banish" }
        ]
    }
  },
  
  standard_12: {
    key: 'standard_12',
    title: '12人标准局',
    description: '标准12人局，角色丰富',
    playerCount: 12,
    roles: {
      werewolf: 4,      // 狼人
      villager: 4,      // 平民
      seer: 1,          // 预言家
      witch: 1,         // 女巫
      hunter: 1,        // 猎人
      guard: 1          // 守卫
    },
    phaseOrder: {
        night: [
          { order: 1, role: "werewolf", eventType: "kill" },
          { order: 2, role: "witch", eventType: "witch_heal" },
          { order: 3, role: "witch", eventType: "witch_poison" },
          { order: 4, role: "seer", eventType: "seer_check" }
        ],
        day: [
          { order: 1, eventType: "announce_deaths" },
          { order: 2, eventType: "speech" },
          { order: 3, eventType: "vote" },
          { order: 4, eventType: "banish" }
        ]
    }
  },
  
  prophet_witch_hunter_guard: {
    key: 'prophet_witch_hunter_guard',
    title: '预女猎守板',
    description: '12人局，包含预言家、女巫、猎人、守卫',
    playerCount: 12,
    roles: {
      werewolf: 4,      // 狼人
      villager: 4,      // 平民
      seer: 1,          // 预言家
      witch: 1,         // 女巫
      hunter: 1,        // 猎人
      guard: 1          // 守卫
    },
    phaseOrder: {
        night: [
          { order: 1, role: "werewolf", eventType: "kill" },
          { order: 2, role: "witch", eventType: "witch_heal" },
          { order: 3, role: "witch", eventType: "witch_poison" },
          { order: 4, role: "seer", eventType: "seer_check" }
        ],
        day: [
          { order: 1, eventType: "announce_deaths" },
          { order: 2, eventType: "speech" },
          { order: 3, eventType: "vote" },
          { order: 4, eventType: "banish" }
        ]
    }
  },
  
  prophet_witch_hunter: {
    key: 'prophet_witch_hunter',
    title: '预女猎板',
    description: '9人局，包含预言家、女巫、猎人',
    playerCount: 9,
    roles: {
      werewolf: 3,      // 狼人
      villager: 3,      // 平民
      seer: 1,          // 预言家
      witch: 1,         // 女巫
      hunter: 1         // 猎人
    },
    phaseOrder: {
        night: [
          { order: 1, role: "werewolf", eventType: "kill" },
          { order: 2, role: "witch", eventType: "witch_heal" },
          { order: 3, role: "witch", eventType: "witch_poison" },
          { order: 4, role: "seer", eventType: "seer_check" }
        ],
        day: [
          { order: 1, eventType: "announce_deaths" },
          { order: 2, eventType: "speech" },
          { order: 3, eventType: "vote" },
          { order: 4, eventType: "banish" }
        ]
    }
  },
  
  prophet_witch_guard: {
    key: 'prophet_witch_guard',
    title: '预女守板',
    description: '9人局，包含预言家、女巫、守卫',
    playerCount: 9,
    roles: {
      werewolf: 3,      // 狼人
      villager: 3,      // 平民
      seer: 1,          // 预言家
      witch: 1,         // 女巫
      guard: 1          // 守卫
    },
    phaseOrder: {
        night: [
          { order: 1, role: "werewolf", eventType: "kill" },
          { order: 2, role: "witch", eventType: "witch_heal" },
          { order: 3, role: "witch", eventType: "witch_poison" },
          { order: 4, role: "seer", eventType: "seer_check" }
        ],
        day: [
          { order: 1, eventType: "announce_deaths" },
          { order: 2, eventType: "speech" },
          { order: 3, eventType: "vote" },
          { order: 4, eventType: "banish" }
        ]
    }
  },
  
  prophet_witch_idiot: {
    key: 'prophet_witch_idiot',
    title: '预女白板',
    description: '9人局，包含预言家、女巫、白痴',
    playerCount: 9,
    roles: {
      werewolf: 3,      // 狼人
      villager: 3,      // 平民
      seer: 1,          // 预言家
      witch: 1,         // 女巫
      idiot: 1          // 白痴
    },
    phaseOrder: {
        night: [
          { order: 1, role: "werewolf", eventType: "kill" },
          { order: 2, role: "witch", eventType: "witch_heal" },
          { order: 3, role: "witch", eventType: "witch_poison" },
          { order: 4, role: "seer", eventType: "seer_check" }
        ],
        day: [
          { order: 1, eventType: "announce_deaths" },
          { order: 2, eventType: "speech" },
          { order: 3, eventType: "vote" },
          { order: 4, eventType: "banish" }
        ]
    }
  },
  
  custom: {
    key: 'custom',
    title: '自定义板子',
    description: '自定义角色配置',
    playerCount: null,
    roles: {},
    phaseOrder: {
        night: [
          { order: 1, role: "werewolf", eventType: "kill" },
          { order: 2, role: "witch", eventType: "witch_heal" },
          { order: 3, role: "witch", eventType: "witch_poison" },
          { order: 4, role: "seer", eventType: "seer_check" }
        ],
        day: [
          { order: 1, eventType: "announce_deaths" },
          { order: 2, eventType: "speech" },
          { order: 3, eventType: "vote" },
          { order: 4, eventType: "banish" }
        ]
    }
  }
};

// 获取所有板子类型的key列表
const getGameTypeKeys = () => {
  return Object.keys(GameTypes);
};

// 根据key获取板子配置
const getGameTypeConfig = (key) => {
  return GameTypes[key] || null;
};

// 获取所有板子配置列表（按order排序）
const getAllGameTypes = () => {
  return Object.values(GameTypes).sort((a, b) => a.order - b.order);
};

// 验证板子类型是否有效
const isValidGameType = (key) => {
  return GameTypes.hasOwnProperty(key);
};

module.exports = {
  GameTypes,
  getGameTypeKeys,
  getGameTypeConfig,
  getAllGameTypes,
  isValidGameType
};

