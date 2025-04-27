import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const protect = async (req, res, next) => {
    try {
        // Extract token using the same method as your service provider middleware
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug log
        
        // Check if decoded contains an ID
        if (!decoded.id) {
            return res.status(401).json({ success: false, message: 'Invalid token: Missing user ID' });
        }
        
        // Make userType check optional since registration tokens might not have it
        // Only restrict if userType is explicitly set to something other than 'customer'
        if (decoded.userType && decoded.userType !== 'customer') {
            console.log('User type mismatch:', decoded.userType);
            return res.status(403).json({ success: false, message: 'Access restricted to customers only' });
        }

        // Find the user in the database
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired, please log in again' });
        }

        console.error('Error in userAuth:', error.message);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

export { protect };