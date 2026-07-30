import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import env from './config/env.js';
import authRoutes from './modules/auth/auth.routes.js';
import vendorRoutes from './modules/vendors/vendors.routes.js';
import productRoutes from './modules/products/products.routes.js';
import enquiryRoutes from './modules/enquiries/enquiries.routes.js';
import cmsRoutes from './modules/cms/cms.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import couponsRoutes from './modules/coupons/coupons.routes.js';
import ordersRoutes from './modules/orders/orders.routes.js';
import ticketsRoutes from './modules/tickets/tickets.routes.js';
import reportsRoutes from './modules/reports/reports.routes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Connect to Database
connectDB();

// Security Headers
app.use(helmet());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { status: 'error', message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/reports', reportsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Central Error Handler
app.use(errorHandler);

const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});
