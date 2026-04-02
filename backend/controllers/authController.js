import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validation
    if (!name || !email || !password || !role) {
      return next(new AppError('Please provide name, email, password and role', 400));
    }
    
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return next(new AppError('User already exists with this email', 400));
    }
    
    // Create new user
    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id, user.role);
    
    res.status(201).json({
      success: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }
    
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }
    
    const token = signToken(user._id, user.role);
    
    res.json({
      success: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
    });
  } catch (error) {
    next(error);
  }
};
