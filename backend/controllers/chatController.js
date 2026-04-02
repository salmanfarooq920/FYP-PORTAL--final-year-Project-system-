import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { AppError } from '../middleware/errorHandler.js';

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'name email')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user.id,
    });
    if (!conversation) return next(new AppError('Conversation not found', 404));
    
    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const { participantIds } = req.body;
    if (!participantIds?.length) {
      return next(new AppError('participantIds required', 400));
    }
    
    const participants = [...new Set([req.user.id, ...participantIds])];
    let conversation = await Conversation.findOne({
      type: 'direct',
      participants: { $all: participants, $size: participants.length },
    });
    
    if (!conversation) {
      conversation = await Conversation.create({ type: 'direct', participants });
    }
    
    await conversation.populate('participants', 'name email');
    res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) {
      return next(new AppError('Message body required', 400));
    }
    
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user.id,
    });
    
    if (!conversation) {
      return next(new AppError('Conversation not found', 404));
    }
    
    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      body: body.trim(),
    });
    
    // Update conversation's lastMessage and updatedAt
    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: body.trim(),
      updatedAt: new Date(),
    });
    
    await message.populate('sender', 'name email');
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};
