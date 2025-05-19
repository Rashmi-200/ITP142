import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import { authRouter } from './routes/authRoutes.js';  
import serviceProviderAuthRouter from './routes/serviceProviderAuthRoutes.js';  
import adminRouter from './routes/adminRoutes.js';
import complaintRouter from './routes/ComplaintRoutes.js';
import evidenceRouter from './routes/evidanceRoutes.js';

// --- New Imports ---
import bookingRouter from './routes/bookingRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import reportRouter from './routes/reportRoutes.js';
import reviewsRouter from './routes/reviewsRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// --- Connect Database ---
connectDB();

// --- Middlewares --- (Move CORS up here, before any routes)
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());  
app.use(cookieParser());

// --- Static Files for uploads ---
app.use('/uploads', express.static('uploads'));

// --- API Endpoints ---
app.get('/', (req, res) => res.send("API Working"));

// --- Routers ---
app.use('/api/auth', authRouter); // User
app.use('/api/serviceProvider/auth', serviceProviderAuthRouter); // Service Provider
app.use('/api/admin/auth', adminRouter); // Admin
app.use('/api/complaints', complaintRouter);
app.use('/api/evidences', evidenceRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/bookings', bookingRouter); // Booking APIs
app.use('/api/payments', paymentRouter); // Payment APIs
app.use('/api/reports', reportRouter);   // Financial Reports APIs

// --- Start Server ---
app.listen(port, () => console.log(`Server started on PORT: ${port}`));