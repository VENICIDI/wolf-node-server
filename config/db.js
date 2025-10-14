// MongoDB连接配置
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wolf-game';
    
    await mongoose.connect(mongoURI, {
      // useNewUrlParser: true,  // Mongoose 6+ 已默认启用
      // useUnifiedTopology: true, // Mongoose 6+ 已默认启用
    });
    
    console.log('MongoDB 连接成功');
    
    // 监听连接事件
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB 连接错误:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB 连接断开');
    });
    
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
