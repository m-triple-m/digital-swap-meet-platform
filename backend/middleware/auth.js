const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // console.log(process.env.JWT_SECRET);
  
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch (err) {
    console.log(err);
    
    res.status(401).json({ error: 'Token is not valid' });
  }
};
