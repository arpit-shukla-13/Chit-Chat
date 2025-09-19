// index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Models
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
app.use(cors());

// Middleware to parse JSON bodies from API requests
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/conversations', require('./routes/conversations'));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React app's URL
    methods: ["GET", "POST"],
  },
});

// Database Connection
const MONGO_URI = 'mongodb+srv://Chit-Chat:Arpitchitchat@mysecuresharecluster.2cdw072.mongodb.net/chatingapp?retryWrites=true&w=majority&appName=MySecureShareCluster';
mongoose.connect(MONGO_URI).then(() => console.log("MongoDB connected")).catch(err => console.log(err));

// This object maps a userId to their current socketId
const onlineUsers = {};

// Socket.IO middleware for JWT authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  jwt.verify(token, 'yourSecretKey', (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
    socket.user = decoded.user;
    next();
  });
});

// Main connection handler for Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected:', socket.user.id);
  
  onlineUsers[socket.user.id] = socket.id;
  io.emit('online_users_update', Object.keys(onlineUsers));

  socket.on('private_message', async ({ recipientId, text }) => {
    try {
      const senderId = socket.user.id;
      // Note: New messages are isSeen: false by default from the schema
      const newMessage = new Message({ sender: senderId, recipient: recipientId, text: text });
      await newMessage.save();

      const recipientSocketId = onlineUsers[recipientId];
      const senderUser = await User.findById(senderId).select('username');
      
      const messageToSend = {
        ...newMessage.toObject(),
        sender: { _id: senderUser._id, username: senderUser.username }
      };

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_private_message', messageToSend);
      }
      socket.emit('receive_private_message', messageToSend);

    } catch (error) {
      console.error('Error handling private message:', error);
    }
  });

  socket.on('typing', ({ recipientId }) => {
    const recipientSocketId = onlineUsers[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user_typing', { senderId: socket.user.id });
    }
  });

  // ## START: New handler for marking messages as seen ##
  socket.on('mark_messages_as_seen', async ({ senderId }) => {
    try {
        const recipientId = socket.user.id;
        // Update all relevant messages in the database
        await Message.updateMany(
            { sender: senderId, recipient: recipientId, isSeen: false },
            { $set: { isSeen: true } }
        );
        
        // Notify the original sender that their messages have been seen
        const senderSocketId = onlineUsers[senderId];
        if (senderSocketId) {
            io.to(senderSocketId).emit('messages_seen_by_recipient', { 
                conversationPartnerId: recipientId // Let the sender know WHO saw the messages
            });
        }
    } catch (error) {
        console.error('Error marking messages as seen:', error);
    }
  });
  // ## END: New handler ##

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.id);
    delete onlineUsers[socket.user.id];
    io.emit('online_users_update', Object.keys(onlineUsers));
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
