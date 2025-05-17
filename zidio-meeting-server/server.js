const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let rooms = {}; // ✅ Declare once at the top

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, userId }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    rooms[roomId].push(socket.id);
    socket.join(roomId);

    console.log(`User ${userId} joined room ${roomId}`);

    // If first user, start the meeting
    if (rooms[roomId].length === 1) {
      io.to(socket.id).emit('start-meeting'); // First user is host
    } else {
      io.to(roomId).emit('participants-update', rooms[roomId]);
    }
  });

  socket.on('waiting-room', ({ roomId }) => {
    console.log(`User waiting for meeting to start: Room ${roomId}`);
  });

  socket.on('sending-signal', (payload) => {
    io.to(payload.userToSignal).emit('user-signal', {
      signal: payload.signal,
      callerId: payload.callerId,
    });
  });

  socket.on('returning-signal', (payload) => {
    io.to(payload.callerId).emit('receiving-returned-signal', {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on('send-message', (messageData) => {
    io.to(messageData.roomId).emit('receive-message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (let room in rooms) {
      rooms[room] = rooms[room].filter((id) => id !== socket.id);
      if (rooms[room].length === 0) {
        delete rooms[room];
      } else {
        io.to(room).emit('participants-update', rooms[room]);
      }
    }
  });
});

server.listen(5000, () => {
  console.log('📡 Meeting server running on port 5000');
});
