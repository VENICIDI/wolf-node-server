// 启动入口
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 连接数据库
connectDB();

// 路由
app.use('/api/user', require('./routes/user'));
// app.use('/api/room', require('./routes/room'));
// app.use('/api/game', require('./routes/game'));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行正常' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app;
