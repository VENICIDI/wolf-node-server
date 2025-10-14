// 用户数据模型（MongoDB）
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  // 系统内部统一唯一ID（UUID）
  userId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    required: true,
    index: true
  },
  
  // 登录来源（wechat, app, web...）
  platform: {
    type: String,
    required: true,
    enum: ['wechat', 'app', 'web', 'admin'],
    index: true
  },
  
  // 微信小程序的唯一ID（选填）
  openid: {
    type: String,
    default: null,
    sparse: true,
    index: true
  },
  
  // 微信跨平台唯一ID（选填）
  unionid: {
    type: String,
    default: null,
    sparse: true,
    index: true
  },
  
  // 手机号（App登录可选）
  phone: {
    type: String,
    default: null,
    sparse: true,
    index: true,
    validate: {
      validator: function(v) {
        return v === null || /^1[3-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} 不是有效的手机号码！`
    }
  },
  
  // 邮箱（可选）
  email: {
    type: String,
    default: null,
    lowercase: true,
    trim: true,
    sparse: true,
    index: true,
    validate: {
      validator: function(v) {
        return v === null || /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(v);
      },
      message: props => `${props.value} 不是有效的邮箱地址！`
    }
  },
  
  // 密码哈希（如果有账号体系）
  passwordHash: {
    type: String,
    default: null
  },
  
  // 昵称
  nickname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  
  // 头像URL
  avatar: {
    type: String,
    default: null,
    trim: true
  },
  
  // 注册时间
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // 更新时间（自动维护）
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // 自动管理 createdAt 和 updatedAt
  collection: 'users'
});

// 索引配置
// 微信平台：根据 openid 查询
userSchema.index({ platform: 1, openid: 1 }, { unique: true, sparse: true });
// 微信平台：根据 unionid 查询
userSchema.index({ platform: 1, unionid: 1 }, { sparse: true });
// App平台：根据手机号查询
userSchema.index({ platform: 1, phone: 1 }, { unique: true, sparse: true });
// Web平台：根据邮箱查询
userSchema.index({ platform: 1, email: 1 }, { unique: true, sparse: true });

// 实例方法：不返回密码哈希
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  delete userObject.__v;
  return userObject;
};

// 静态方法：根据平台和标识查找用户
userSchema.statics.findByPlatformIdentifier = async function(platform, identifier) {
  const query = { platform };
  
  if (identifier.openid) {
    query.openid = identifier.openid;
  } else if (identifier.unionid) {
    query.unionid = identifier.unionid;
  } else if (identifier.phone) {
    query.phone = identifier.phone;
  } else if (identifier.email) {
    query.email = identifier.email;
  } else if (identifier.userId) {
    query.userId = identifier.userId;
  }
  
  return this.findOne(query);
};

// 静态方法：创建或更新用户
userSchema.statics.createOrUpdate = async function(userData) {
  const { platform, openid, unionid, phone, email, ...otherData } = userData;
  
  let query = { platform };
  if (openid) query.openid = openid;
  else if (unionid) query.unionid = unionid;
  else if (phone) query.phone = phone;
  else if (email) query.email = email;
  
  const user = await this.findOne(query);
  
  if (user) {
    // 更新现有用户
    Object.assign(user, otherData);
    user.updatedAt = new Date();
    await user.save();
    return user;
  } else {
    // 创建新用户
    return this.create(userData);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;

