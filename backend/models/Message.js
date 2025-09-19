const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  // ## YEH NAYI FIELD ADD KI GAYI HAI ##
  isSeen: { type: Boolean, default: false },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
