import jwt from 'jsonwebtoken';
import serviceProviderModel from '../models/serProModel.js';

export const protect = async (req, res, next) => {
    let token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await serviceProviderModel.findById(decoded.id);
        
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'Service provider not found' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};
