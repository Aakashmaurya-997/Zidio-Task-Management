const ChatMessage = require('../models/ChatMessage');

exports.getMessages = async (req, res) => {
  const messages = await ChatMessage.find().populate('sender', 'name');
  res.json(messages);
};

exports.sendMessage = async (req, res) => {
  const message = await ChatMessage.create({
    text: req.body.text,
    sender: req.user._id,
  });
  res.status(201).json(message);
};
