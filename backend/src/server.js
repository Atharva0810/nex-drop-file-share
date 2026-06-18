const fastify = require('fastify');
const cors = require('@fastify/cors');
const { Server } = require('socket.io');
const storage = require('./utils/storage');

const app = fastify({ logger: true });

// CORS setup
app.register(cors, {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
});

// Socket.IO setup
const io = new Server(app.server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  // Join room event
  socket.on('room:join', (data) => {
    const { roomId, memberId, memberName } = data;
    console.log(`[Socket] ${memberName} joining room ${roomId}`);

    // Add to storage
    storage.addMember(roomId, memberId, memberName);
    
    // Join socket to room namespace
    socket.join(`room:${roomId}`);
    
    // Notify others in room
    io.to(`room:${roomId}`).emit('member:joined', {
      memberId,
      memberName,
      members: storage.getRoomMembers(roomId),
      timestamp: new Date(),
    });

    socket.emit('room:joined', {
      success: true,
      members: storage.getRoomMembers(roomId),
    });
  });

  // Leave room event
  socket.on('room:leave', (data) => {
    const { roomId, memberId, memberName } = data;
    console.log(`[Socket] ${memberName} leaving room ${roomId}`);

    storage.removeMember(roomId, memberId);
    
    io.to(`room:${roomId}`).emit('member:left', {
      memberId,
      memberName,
      members: storage.getRoomMembers(roomId),
      timestamp: new Date(),
    });

    socket.leave(`room:${roomId}`);
  });

  // File uploaded event
  socket.on('file:uploaded', (data) => {
    const { roomId, fileId, filename, uploaderName } = data;
    console.log(`[Socket] File uploaded: ${filename} to room ${roomId}`);

    io.to(`room:${roomId}`).emit('file:added', {
      fileId,
      filename,
      uploaderName,
      files: storage.getRoomFiles(roomId),
      timestamp: new Date(),
    });
  });

  // File deleted event
  socket.on('file:deleted', (data) => {
    const { roomId, fileId, filename } = data;
    console.log(`[Socket] File deleted: ${filename} from room ${roomId}`);

    io.to(`room:${roomId}`).emit('file:removed', {
      fileId,
      filename,
      files: storage.getRoomFiles(roomId),
      timestamp: new Date(),
    });
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
});

// Routes
app.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date() };
});

app.get('/api/stats', async (request, reply) => {
  return storage.getStats();
});

// Room routes
app.post('/api/rooms', async (request, reply) => {
  const { name, isPublic, password } = request.body;
  
  if (!name) {
    return reply.status(400).send({ error: 'Room name required' });
  }

  const room = storage.createRoom(name, isPublic !== false, password || null);
  return reply.status(201).send(room);
});

app.get('/api/rooms', async (request, reply) => {
  const rooms = storage.getAllRooms();
  return reply.send(rooms);
});

app.get('/api/rooms/:roomId', async (request, reply) => {
  const { roomId } = request.params;
  const room = storage.getRoom(roomId);
  
  if (!room) {
    return reply.status(404).send({ error: 'Room not found' });
  }

  return reply.send({
    ...room,
    members: storage.getRoomMembers(roomId),
    files: storage.getRoomFiles(roomId),
  });
});

app.put('/api/rooms/:roomId', async (request, reply) => {
  const { roomId } = request.params;
  const { name, isPublic, password } = request.body;

  const room = storage.updateRoom(roomId, { name, isPublic, password });
  
  if (!room) {
    return reply.status(404).send({ error: 'Room not found' });
  }

  // Notify room members
  io.to(`room:${roomId}`).emit('room:updated', {
    room,
    timestamp: new Date(),
  });

  return reply.send(room);
});

app.delete('/api/rooms/:roomId', async (request, reply) => {
  const { roomId } = request.params;
  const success = storage.deleteRoom(roomId);

  if (!success) {
    return reply.status(404).send({ error: 'Room not found' });
  }

  io.to(`room:${roomId}`).emit('room:deleted', { roomId });

  return reply.send({ success: true });
});

// Room members
app.get('/api/rooms/:roomId/members', async (request, reply) => {
  const { roomId } = request.params;
  const members = storage.getRoomMembers(roomId);

  if (!members) {
    return reply.status(404).send({ error: 'Room not found' });
  }

  return reply.send(members);
});

app.post('/api/rooms/:roomId/members', async (request, reply) => {
  const { roomId } = request.params;
  const { memberId, memberName } = request.body;

  if (!memberId || !memberName) {
    return reply.status(400).send({ error: 'memberId and memberName required' });
  }

  const member = storage.addMember(roomId, memberId, memberName);

  if (!member) {
    return reply.status(404).send({ error: 'Room not found' });
  }

  return reply.status(201).send(member);
});

app.delete('/api/rooms/:roomId/members/:memberId', async (request, reply) => {
  const { roomId, memberId } = request.params;
  const success = storage.removeMember(roomId, memberId);

  if (!success) {
    return reply.status(404).send({ error: 'Member not found' });
  }

  return reply.send({ success: true });
});

// Files
app.get('/api/rooms/:roomId/files', async (request, reply) => {
  const { roomId } = request.params;
  const files = storage.getRoomFiles(roomId);

  return reply.send(files.map(f => ({
    id: f.id,
    filename: f.filename,
    mimetype: f.mimetype,
    size: f.size,
    uploaderName: f.uploaderName,
    uploadedAt: f.uploadedAt,
  })));
});

app.post('/api/rooms/:roomId/files', async (request, reply) => {
  const { roomId } = request.params;
  const { filename, mimetype, size, uploaderName, data } = request.body;

  if (!filename || !uploaderName) {
    return reply.status(400).send({ error: 'filename and uploaderName required' });
  }

  const file = storage.uploadFile(roomId, filename, mimetype || 'application/octet-stream', size || 0, uploaderName);
  
  if (data) {
    storage.setFileData(file.id, Buffer.from(data, 'base64'));
  }

  return reply.status(201).send({
    id: file.id,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
    uploaderName: file.uploaderName,
    uploadedAt: file.uploadedAt,
  });
});

app.get('/api/rooms/:roomId/files/:fileId', async (request, reply) => {
  const { fileId } = request.params;
  const file = storage.getFile(fileId);

  if (!file) {
    return reply.status(404).send({ error: 'File not found' });
  }

  reply.header('Content-Type', file.mimetype);
  reply.header('Content-Disposition', `attachment; filename="${file.filename}"`);

  return reply.send(file.data);
});

app.delete('/api/rooms/:roomId/files/:fileId', async (request, reply) => {
  const { fileId } = request.params;
  const file = storage.getFile(fileId);

  if (!file) {
    return reply.status(404).send({ error: 'File not found' });
  }

  storage.deleteFile(fileId);

  return reply.send({ success: true });
});

// Start server
const start = async () => {
  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    console.log('Server running at http://0.0.0.0:4000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
