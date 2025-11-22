import User from '../models/User.js';
import { generateToken } from '../lib/utils.js';
import bcrypt from 'bcryptjs';
import {ENV} from "../lib/env.js"

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({message: 'All fields are required'})
        }

        // check if email is valid: regex

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: 'Email is not valid'})   
        }

        if (password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters'})
        }

        const user = await User.findOne({email})
        if (user) {
            return res.status(400).json({message: 'Email already used'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save();
        generateToken(newUser._id, res);

        res.status(201).json({
            _id: savedUser._id,
            fullName: savedUser.fullName,
            email: savedUser.email,
            profilePic: savedUser.profilePic
        });


    } catch (error) {
        console.error('error in signup controller', error);
        // Handle race-condition duplicate key (unique email) from Mongo
        if (error?.code === 11000 && (error?.keyPattern?.email || error?.keyValue?.email)) {
            return res.status(400).json({ message: 'Email already used' });
        }
        return next(error);
    }
};

export const login = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({message: 'All fields are required'})
        }

        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'})
        }
        
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

        console.log('login successful', user.email);
    } catch (error) {
        console.error('error in login controller', error);
        return res.status(500).json({ message: 'Internal server error' });
        
    }
};

export const logout = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: ENV.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 0
    });
    res.status(200).json({message: 'Logout successful'});
    console.log(`${req.user.email} logout successful`);
}

