const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided', code: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    res.status(403).json({ success: false, message: 'Invalid or expired token', code: 403 });
  }
};
