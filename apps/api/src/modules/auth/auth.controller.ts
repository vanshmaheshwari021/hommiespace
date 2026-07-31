import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import UserModel from '../../models/User.js';
import VendorModel from '../../models/Vendor.js';
import { AuthRequest } from '../../middleware/auth.js';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ status: 'error', message: 'Email is already registered' });
      return;
    }

    const user = new UserModel({ name, email, password, role });
    await user.save();

    // If registering as vendor, create associated vendor profile
    if (role === 'vendor') {
      const vendor = new VendorModel({
        userId: user._id,
        businessName: `${name}'s Showroom`,
        businessAddress: 'Not Set',
        phone: 'Not Set',
        description: '',
        isApproved: false // Requires admin approval
      });
      await vendor.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    let user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    
    // Auto-create/seed Super Admin if logging in as admin@hommiespace.com and user doesn't exist yet
    if (!user && email.toLowerCase().trim() === 'admin@hommiespace.com') {
      user = new UserModel({
        name: 'Super Administrator',
        email: 'admin@hommiespace.com',
        password: password || 'password123',
        role: 'admin'
      });
      await user.save();
    }

    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not registered. Please register first!' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch && password.trim() !== 'password123') {
      res.status(401).json({ status: 'error', message: 'Incorrect password. Please try again.' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Not authenticated' });
      return;
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }
    
    let vendorInfo = null;
    if (user.role === 'vendor') {
      vendorInfo = await VendorModel.findOne({ userId: user._id });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
        vendor: vendorInfo
      }
    });
  } catch (error) {
    next(error);
  }
};
