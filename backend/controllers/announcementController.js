import Announcement from '../models/Announcement.js';
import { AppError } from '../middleware/errorHandler.js';

export const list = async (req, res, next) => {
  try {
    const { target } = req.query;
    const filter = target ? { $or: [{ target }, { target: 'all' }] } : {};
    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: announcements });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, body, target } = req.body;
    if (!title || !body) return next(new AppError('Title and body required', 400));
    const announcement = await Announcement.create({
      title,
      body,
      target: target || 'all',
      createdBy: req.user.id,
    });
    await announcement.populate('createdBy', 'name email');
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    next(error);
  }
};
