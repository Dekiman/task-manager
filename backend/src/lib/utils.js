import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';

const JWT_SECRET = ENV.JWT_SECRET;
const NODE_ENV = ENV.NODE_ENV;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}


export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId:userId }, JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie('jwt', token, {
        httpOnly: true, //prevents xss attacks
        secure: NODE_ENV === 'development' ? false : true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
};