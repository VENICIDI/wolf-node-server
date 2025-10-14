// 用户路由
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// 创建用户
router.post('/create', UserController.createUser.bind(UserController));

// 获取用户信息
router.get('/:userId', UserController.getUserById.bind(UserController));

// 微信小程序登录
router.post('/wechat-login', UserController.wechatLogin.bind(UserController));

// 手机号登录
router.post('/phone-login', UserController.phoneLogin.bind(UserController));

// 邮箱登录
router.post('/email-login', UserController.emailLogin.bind(UserController));

// 更新用户信息
router.put('/:userId', UserController.updateUser.bind(UserController));

module.exports = router;

