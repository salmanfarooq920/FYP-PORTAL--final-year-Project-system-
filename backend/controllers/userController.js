import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

export const list = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const get = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return next(new AppError('User not found', 404));
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return next(new AppError('Provide name, email, password, role', 400));
    }
    const exists = await User.findOne({ email });
    if (exists) return next(new AppError('Email already in use', 400));
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ 
      success: true, 
      data: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { name, email, role, department } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    if (name != null) user.name = name;
    if (email != null) user.email = email;
    if (role != null) user.role = role;
    if (department != null) user.department = department;
    await user.save();
    res.json({ 
      success: true, 
      data: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
