import { AppError } from './errorHandler.js';

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Access denied', 403));
  }
  next();
};
