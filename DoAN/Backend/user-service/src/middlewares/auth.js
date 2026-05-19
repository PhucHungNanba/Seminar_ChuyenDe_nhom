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

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin role required', code: 403 });
  }
};

exports.verifyAdminOrPharmacist = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role === 'Pharmacist')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin or Pharmacist role required', code: 403 });
  }
};

