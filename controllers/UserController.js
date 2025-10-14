// 用户控制器
const UserService = require('../services/UserService');

class UserController {
  /**
   * 创建用户
   * POST /api/user/create
   */
  async createUser(req, res) {
    try {
      const userData = req.body;
      const user = await UserService.createUser(userData);
      res.status(201).json({
        success: true,
        message: '用户创建成功',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * 获取用户信息
   * GET /api/user/:userId
   */
  async getUserById(req, res) {
    try {
      const { userId } = req.params;
      const user = await UserService.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * 微信小程序登录
   * POST /api/user/wechat-login
   */
  async wechatLogin(req, res) {
    try {
      const { code, userInfo } = req.body;
      
      // 这里应该调用微信API获取openid和unionid
      // 示例代码，需要实现wechatAuth.getOpenId
      // const { openid, unionid } = await wechatAuth.getOpenId(code);
      
      // 临时示例
      const openid = req.body.openid;
      const unionid = req.body.unionid;
      
      if (!openid) {
        return res.status(400).json({
          success: false,
          message: 'openid不能为空'
        });
      }
      
      const user = await UserService.wechatLogin(openid, unionid, userInfo);
      
      res.json({
        success: true,
        message: '登录成功',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * 手机号登录
   * POST /api/user/phone-login
   */
  async phoneLogin(req, res) {
    try {
      const { phone, password, nickname } = req.body;
      
      if (!phone || !password) {
        return res.status(400).json({
          success: false,
          message: '手机号和密码不能为空'
        });
      }
      
      const user = await UserService.phoneLogin(phone, password, nickname);
      
      res.json({
        success: true,
        message: '登录成功',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * 邮箱登录
   * POST /api/user/email-login
   */
  async emailLogin(req, res) {
    try {
      const { email, password, nickname } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: '邮箱和密码不能为空'
        });
      }
      
      const user = await UserService.emailLogin(email, password, nickname);
      
      res.json({
        success: true,
        message: '登录成功',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * 更新用户信息
   * PUT /api/user/:userId
   */
  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      
      const user = await UserService.updateUser(userId, updateData);
      
      res.json({
        success: true,
        message: '用户信息更新成功',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new UserController();

