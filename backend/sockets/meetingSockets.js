// /sockets/meetingSockets.js

const rooms = {}; // { roomId: [socketId, ...] }
const roomHosts = {}; // { roomId: hostUserId }

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);

    socket.on('join-room', ({ roomId, userId }) => {
      socket.join(roomId);

      const isHost = !roomHosts[roomId];
      if (isHost) roomHosts[roomId] = userId;

      if (!rooms[roomId]) rooms[roomId] = [];
      rooms[roomId].push(socket.id);

      io.to(roomId).emit('user-joined', { userId, isHost });
      io.to(roomId).emit('participants-update', rooms[roomId]);
    });

    socket.on('host-started', ({ roomId }) => {
      io.to(roomId).emit('host-started');
    });

    socket.on('sending-signal', ({ userToSignal, callerId, signal }) => {
      io.to(userToSignal).emit('user-signal', { signal, callerId });
    });

    socket.on('returning-signal', ({ callerId, signal }) => {
      io.to(callerId).emit('receiving-returned-signal', { signal, id: socket.id });
    });

    socket.on('send-message', (messageData) => {
      io.to(messageData.roomId).emit('receive-message', messageData);
    });

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.id);

      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
        io.to(roomId).emit('participants-update', rooms[roomId]);

        // Clean up empty rooms
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
          delete roomHosts[roomId];
        }
      }
    });
  });
};
