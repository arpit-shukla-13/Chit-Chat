// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: loggedInUserId },
      ],
    }).sort({ timestamp: 1 }).populate('sender', 'username'); 

    res.json(messages);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;