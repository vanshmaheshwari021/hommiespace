import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import UserModel from './apps/api/src/models/User';
import VendorModel from './apps/api/src/models/Vendor';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hommiespace';

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    console.log('Using URI:', MONGODB_URI.replace(/:([^@]+)@/, ':****@')); // Hide password in logs
    await mongoose.connect(MONGODB_URI);
    console.log('Connected! Clearing previous users & vendors...');
    
    await UserModel.deleteMany({});
    await VendorModel.deleteMany({});

    console.log('Seeding users...');
    
    // Create admin
    const admin = new UserModel({
      name: 'Super Admin',
      email: 'admin@hommiespace.com',
      password: 'password123',
      role: 'admin'
    });
    await admin.save();

    // Create vendors
    const vendorNames = ['Nordic Designs', 'Clay & Co', 'Modernist Spaces'];
    const vendorEmails = ['nordic@hommiespace.com', 'clay@hommiespace.com', 'modernist@hommiespace.com'];

    for (let i = 0; i < 3; i++) {
      const vUser = new UserModel({
        name: `${vendorNames[i]} Owner`,
        email: vendorEmails[i],
        password: 'password123',
        role: 'vendor'
      });
      await vUser.save();

      const vProfile = new VendorModel({
        userId: vUser._id,
        businessName: vendorNames[i],
        businessAddress: `${100 + i * 50} Design District, Jodhpur`,
        phone: `+91 98765 4321${i}`,
        description: `Premium hand-crafted custom furniture and home decor from ${vendorNames[i]}.`,
        isApproved: true
      });
      await vProfile.save();
    }

    // Create customers
    for (let i = 1; i <= 10; i++) {
      const customer = new UserModel({
        name: `Customer ${i}`,
        email: `customer${i}@gmail.com`,
        password: 'password123',
        role: 'customer'
      });
      await customer.save();
    }

    console.log('Database successfully seeded with users and vendors!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
