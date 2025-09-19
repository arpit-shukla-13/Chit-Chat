const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.split(' ')[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // ## START: YAHAN BADLAV KIYA GAYA HAI ##
    // Use the environment variable for verification, not a hardcoded string
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // ## END: BADLAV POORA HUA ##
    
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};