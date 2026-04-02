import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const userSockets = new Map();

export const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:5173' },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Auth required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    userSockets.set(socket.userId.toString(), socket.id);

    socket.on('message:send', ({ toUserId, body, conversationId }) => {
      const targetSocketId = userSockets.get(toUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('message:receive', {
          fromUserId: socket.userId,
          body,
          conversationId,
          createdAt: new Date(),
        });
      }
    });

    socket.on('disconnect', () => {
      userSockets.delete(socket.userId.toString());
    });
  });

  return io;
};
