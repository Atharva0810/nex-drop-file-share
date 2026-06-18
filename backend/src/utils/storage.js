const { v4: uuidv4 } = require('uuid');

class StorageManager {
  constructor() {
    this.rooms = new Map();
    this.files = new Map();
    this.members = new Map();
  }

  // Room operations
  createRoom(name, isPublic = true, password = null) {
    const roomId = uuidv4();
    const room = {
      id: roomId,
      name,
      isPublic,
      password: password || null,
      createdAt: new Date(),
      members: [],
      fileCount: 0,
    };
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  updateRoom(roomId, updates) {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    const updated = { ...room, ...updates };
    this.rooms.set(roomId, updated);
    return updated;
  }

  deleteRoom(roomId) {
    // Delete all files in room
    const fileIds = Array.from(this.files.entries())
      .filter(([_, file]) => file.roomId === roomId)
      .map(([id]) => id);
    
    fileIds.forEach(fileId => this.files.delete(fileId));
    return this.rooms.delete(roomId);
  }

  // Member operations
  addMember(roomId, memberId, memberName) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const member = {
      id: memberId,
      name: memberName,
      joinedAt: new Date(),
    };

    if (!room.members.find(m => m.id === memberId)) {
      room.members.push(member);
    }

    this.members.set(`${roomId}:${memberId}`, member);
    return member;
  }

  removeMember(roomId, memberId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.members = room.members.filter(m => m.id !== memberId);
    this.members.delete(`${roomId}:${memberId}`);
    
    // Delete room if empty
    if (room.members.length === 0) {
      this.deleteRoom(roomId);
    }
    return true;
  }

  getRoomMembers(roomId) {
    const room = this.rooms.get(roomId);
    return room ? room.members : [];
  }

  // File operations
  uploadFile(roomId, filename, mimetype, size, uploaderName) {
    const fileId = uuidv4();
    const file = {
      id: fileId,
      roomId,
      filename,
      mimetype,
      size,
      uploaderName,
      uploadedAt: new Date(),
      data: Buffer.alloc(0), // Will hold file data
    };

    this.files.set(fileId, file);
    
    const room = this.rooms.get(roomId);
    if (room) {
      room.fileCount = (room.fileCount || 0) + 1;
    }

    return file;
  }

  getFile(fileId) {
    return this.files.get(fileId);
  }

  getRoomFiles(roomId) {
    return Array.from(this.files.values()).filter(f => f.roomId === roomId);
  }

  deleteFile(fileId) {
    const file = this.files.get(fileId);
    if (!file) return false;

    const room = this.rooms.get(file.roomId);
    if (room) {
      room.fileCount = Math.max(0, (room.fileCount || 1) - 1);
    }

    this.files.delete(fileId);
    return true;
  }

  setFileData(fileId, data) {
    const file = this.files.get(fileId);
    if (!file) return false;
    file.data = data;
    return true;
  }

  getFileData(fileId) {
    const file = this.files.get(fileId);
    return file ? file.data : null;
  }

  // Stats
  getStats() {
    return {
      roomCount: this.rooms.size,
      fileCount: this.files.size,
      totalMembers: this.members.size,
      rooms: Array.from(this.rooms.values()).map(r => ({
        id: r.id,
        name: r.name,
        memberCount: r.members.length,
        fileCount: r.fileCount || 0,
      })),
    };
  }
}

module.exports = new StorageManager();
