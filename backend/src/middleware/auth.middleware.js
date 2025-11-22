import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({message: 'Not authorized - No token'});
        }
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({message: 'Not authorized - Invalid token'});
        }
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({message: 'Not authorized - User not found'});
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Error in portectRoute middleware", error);
        res.status(500).json({message: 'Internal server error'});
    }
}