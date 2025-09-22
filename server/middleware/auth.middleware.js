const jwt = require('jsonwebtoken');
const ResponseUtil = require('../utils/response.util');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ResponseUtil.unauthorized(res, 'No token provided');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = {
            user_id: decoded.user_id
        };
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return ResponseUtil.unauthorized(res, 'Invalid or expired token');
        }
        next(error);
    }
};

module.exports = authMiddleware;
