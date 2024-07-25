const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = 'your_jwt_secret'; // Use an environment variable in production

const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied, admin only' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};

module.exports = { authenticate, isAdmin };