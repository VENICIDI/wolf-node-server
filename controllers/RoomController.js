import RoomService from '../services/RoomService';
class RoomController {
  constructor() {
    this.roomService = new RoomService();
  }

  async createRoom(req, res) {
    try {
      const { userId } = req.params;
      const room = await this.roomService.createRoom(userId);
      res.status(201).json({
        message: '房间创建成功',
        data: room
      });
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }

  async joinRoom(req, res) {
    try {
      const { userId } = req.params;
      const room = await this.roomService.joinRoom(userId);
      res.status(200).json({
        message: '房间加入成功',
        data: room
      });
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }

  async leaveRoom(req, res) {
    try {
      const { userId } = req.params;
      const room = await this.roomService.leaveRoom(userId);
      res.status(200).json({
        message: '房间离开成功',
        data: room
      });
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
}

module.exports = RoomController;
