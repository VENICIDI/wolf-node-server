# User 用户模型使用说明

## 数据表结构

### User 表（统一用户模型）

| 字段 | 类型 | 说明 | 是否必填 |
|------|------|------|---------|
| userId | String | 系统内部统一唯一ID（UUID） | 是（自动生成） |
| platform | String | 登录来源（wechat, app, web, admin） | 是 |
| openid | String | 微信小程序的唯一ID | 否 |
| unionid | String | 微信跨平台唯一ID | 否 |
| phone | String | 手机号（App登录） | 否 |
| email | String | 邮箱 | 否 |
| passwordHash | String | 密码哈希 | 否 |
| nickname | String | 昵称 | 是 |
| avatar | String | 头像URL | 否 |
| createdAt | Date | 注册时间 | 是（自动生成） |
| updatedAt | Date | 更新时间 | 是（自动维护） |

## 安装依赖

```bash
npm install
```

## 环境配置

复制 `.env.example` 为 `.env`，并配置相应的环境变量：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```
MONGODB_URI=mongodb://localhost:27017/wolf-game
PORT=3000
NODE_ENV=development
```

## 启动服务

```bash
node app.js
```

## API 接口说明

### 1. 创建用户

**接口：** `POST /api/user/create`

**请求体：**
```json
{
  "platform": "app",
  "phone": "13800138000",
  "password": "123456",
  "nickname": "张三",
  "avatar": "https://example.com/avatar.jpg"
}
```

**响应：**
```json
{
  "success": true,
  "message": "用户创建成功",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "platform": "app",
    "phone": "13800138000",
    "nickname": "张三",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. 微信小程序登录

**接口：** `POST /api/user/wechat-login`

**请求体：**
```json
{
  "openid": "oxxxxxxxxxxxxxx",
  "unionid": "oxxxxxxxxxxxxxx",
  "userInfo": {
    "nickname": "微信昵称",
    "avatar": "https://wx.qlogo.cn/..."
  }
}
```

**响应：**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "platform": "wechat",
    "openid": "oxxxxxxxxxxxxxx",
    "unionid": "oxxxxxxxxxxxxxx",
    "nickname": "微信昵称",
    "avatar": "https://wx.qlogo.cn/..."
  }
}
```

### 3. 手机号登录

**接口：** `POST /api/user/phone-login`

**请求体：**
```json
{
  "phone": "13800138000",
  "password": "123456",
  "nickname": "用户昵称"
}
```

### 4. 邮箱登录

**接口：** `POST /api/user/email-login`

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "nickname": "用户昵称"
}
```

### 5. 获取用户信息

**接口：** `GET /api/user/:userId`

**响应：**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "platform": "app",
    "nickname": "张三",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

### 6. 更新用户信息

**接口：** `PUT /api/user/:userId`

**请求体：**
```json
{
  "nickname": "新昵称",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

### 8. 获取用户列表

**接口：** `GET /api/user/list?page=1&limit=20&platform=wechat`

**查询参数：**
- `page`: 页码（默认1）
- `limit`: 每页数量（默认20）
- `platform`: 平台筛选（可选）

**响应：**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## 数据库索引

模型已配置以下索引以提高查询性能：

1. `userId` - 唯一索引
2. `platform` - 普通索引
3. `openid` - 稀疏索引
4. `unionid` - 稀疏索引
5. `phone` - 稀疏索引
6. `email` - 稀疏索引
7. `{ platform, openid }` - 复合唯一索引
8. `{ platform, phone }` - 复合唯一索引
9. `{ platform, email }` - 复合唯一索引

## 模型方法

### 实例方法

#### toSafeObject()
返回不包含密码哈希的用户对象，用于API响应：

```javascript
const user = await User.findOne({ userId });
const safeUser = user.toSafeObject();
```

### 静态方法

#### findByPlatformIdentifier(platform, identifier)
根据平台和标识查找用户：

```javascript
const user = await User.findByPlatformIdentifier('wechat', { 
  openid: 'oxxxxxxxxxxxxxx' 
});
```

#### createOrUpdate(userData)
创建或更新用户（如果已存在则更新）：

```javascript
const user = await User.createOrUpdate({
  platform: 'wechat',
  openid: 'oxxxxxxxxxxxxxx',
  nickname: '微信用户'
});
```

## 数据验证

### 手机号验证
- 格式：1开头的11位数字
- 正则：`/^1[3-9]\d{9}$/`

### 邮箱验证
- 标准邮箱格式
- 自动转为小写
- 自动去除首尾空格

### 昵称验证
- 必填字段
- 最大长度：50字符
- 自动去除首尾空格

## 密码处理

密码使用 bcrypt 进行哈希加密：

```javascript
// 创建用户时自动加密
const user = await UserService.createUser({
  platform: 'app',
  phone: '13800138000',
  password: '123456',  // 将自动加密为 passwordHash
  nickname: '用户'
});

// 验证密码
const isMatch = await bcrypt.compare(inputPassword, user.passwordHash);
```

## 使用示例

### 在代码中使用 User 模型

```javascript
const User = require('./models/User');

// 创建用户
const newUser = await User.create({
  platform: 'app',
  phone: '13800138000',
  nickname: '张三'
});

// 查询用户
const user = await User.findOne({ userId: 'xxx' });

// 更新用户
await User.findOneAndUpdate(
  { userId: 'xxx' },
  { nickname: '新昵称' },
  { new: true }
);

```

### 在 Service 层使用

```javascript
const UserService = require('./services/UserService');

// 微信登录
const user = await UserService.wechatLogin(
  openid,
  unionid,
  { nickname: '微信用户', avatar: 'xxx' }
);

// 手机号登录
const user = await UserService.phoneLogin(
  '13800138000',
  '123456',
  '用户昵称'
);

// 更新用户信息
const updatedUser = await UserService.updateUser(
  userId,
  { nickname: '新昵称' }
);
```

## 注意事项

1. **密码安全**：密码不会存储明文，只存储bcrypt哈希值
2. **唯一性约束**：同一平台下，openid/phone/email 必须唯一
3. **索引优化**：已配置合适的索引，查询性能良好
4. **数据验证**：手机号和邮箱会自动验证格式
5. **敏感信息**：使用 `toSafeObject()` 方法时不会返回密码哈希

## 扩展建议

如果需要添加更多功能，可以考虑：

1. **JWT认证**：添加 token 生成和验证
2. **角色权限**：添加 role 字段（user, admin, etc.）
3. **账号状态**：添加 status 字段（active, banned, etc.）
4. **第三方登录**：支持更多平台（QQ, 微博等）
5. **登录日志**：记录登录时间、IP等信息
6. **实名认证**：添加身份证、真实姓名等字段

