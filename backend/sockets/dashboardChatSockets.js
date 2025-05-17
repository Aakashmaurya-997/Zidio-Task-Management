// /sockets/dashboardChatSockets.js

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('💬 Dashboard user connected:', socket.id);

    // Listen for incoming messages
    socket.on('dashboard-chat-message', (message) => {
      // Broadcast message to all connected clients
      io.emit('dashboard-chat-message', message);
    });

    socket.on('disconnect', () => {
      console.log('💬 Dashboard user disconnected:', socket.id);
    });
  });
};
