// 用户服务层
const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserService {
  /**
   * 创建新用户
   */
  async createUser(userData) {
    try {
      // 如果有密码，进行哈希处理
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.passwordHash = await bcrypt.hash(userData.password, salt);
        delete userData.password;
      }
      
      const user = await User.create(userData);
      return user.toSafeObject();
    } catch (error) {
      throw new Error(`创建用户失败: ${error.message}`);
    }
  }
  
  /**
   * 根据userId获取用户
   */
  async getUserById(userId) {
    try {
      const user = await User.findOne({ userId });
      return user ? user.toSafeObject() : null;
    } catch (error) {
      throw new Error(`获取用户失败: ${error.message}`);
    }
  }
  
  /**
   * 根据平台和标识查找用户
   */
  async findByPlatformIdentifier(platform, identifier) {
    try {
      const user = await User.findByPlatformIdentifier(platform, identifier);
      return user ? user.toSafeObject() : null;
    } catch (error) {
      throw new Error(`查找用户失败: ${error.message}`);
    }
  }
  
  /**
   * 微信小程序登录/注册
   */
  async wechatLogin(openid, unionid = null, userInfo = {}) {
    try {
      const userData = {
        platform: 'wechat',
        openid,
        unionid,
        nickname: userInfo.nickname || '微信用户',
        avatar: userInfo.avatar || null
      };
      
      const user = await User.createOrUpdate(userData);
      return user.toSafeObject();
    } catch (error) {
      throw new Error(`微信登录失败: ${error.message}`);
    }
  }
  
  /**
   * 手机号登录/注册
   */
  async phoneLogin(phone, password, nickname = null) {
    try {
      let user = await User.findOne({ platform: 'app', phone });
      
      if (user) {
        // 验证密码
        if (password && user.passwordHash) {
          const isMatch = await bcrypt.compare(password, user.passwordHash);
          if (!isMatch) {
            throw new Error('密码错误');
          }
        }
        return user.toSafeObject();
      } else {
        // 创建新用户
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        user = await User.create({
          platform: 'app',
          phone,
          passwordHash,
          nickname: nickname || `用户${phone.slice(-4)}`
        });
        
        return user.toSafeObject();
      }
    } catch (error) {
      throw new Error(`手机号登录失败: ${error.message}`);
    }
  }
  
  /**
   * 邮箱登录/注册
   */
  async emailLogin(email, password, nickname = null) {
    try {
      let user = await User.findOne({ platform: 'web', email });
      
      if (user) {
        // 验证密码
        if (password && user.passwordHash) {
          const isMatch = await bcrypt.compare(password, user.passwordHash);
          if (!isMatch) {
            throw new Error('密码错误');
          }
        }
        return user.toSafeObject();
      } else {
        // 创建新用户
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        user = await User.create({
          platform: 'web',
          email,
          passwordHash,
          nickname: nickname || email.split('@')[0]
        });
        
        return user.toSafeObject();
      }
    } catch (error) {
      throw new Error(`邮箱登录失败: ${error.message}`);
    }
  }
  
  /**
   * 更新用户信息
   */
  async updateUser(userId, updateData) {
    try {
      // 不允许直接更新的字段
      delete updateData.userId;
      delete updateData.platform;
      delete updateData.openid;
      delete updateData.unionid;
      delete updateData.createdAt;
      delete updateData.passwordHash;
      
      // 如果要更新密码，使用password字段
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
        delete updateData.password;
      }
      
      const user = await User.findOneAndUpdate(
        { userId },
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!user) {
        throw new Error('用户不存在');
      }
      
      return user.toSafeObject();
    } catch (error) {
      throw new Error(`更新用户失败: ${error.message}`);
    }
  }
}

module.exports = new UserService();

