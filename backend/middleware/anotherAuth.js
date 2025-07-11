import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const anotherAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = { id: user._id };
    next();
  } catch (err) {
    console.error("Auth error", err);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
