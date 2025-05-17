// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB(); // MongoDB connection

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => res.send('✅ API is running...'));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/uploads', express.static('uploads'));

// Socket.IO handlers
require('./sockets/meetingSockets')(io);
require('./sockets/dashboardChatSockets')(io);

// Start server
const PORT = process.env.PORT || 5174;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
