// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

// Export the protect middle to ensure the 
// user signs in before he can initiate payment
export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalid or expired'});
    }
}