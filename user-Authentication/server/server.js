import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import { authRouter } from './routes/authRoutes.js';  // Regular user auth routes
import serviceProviderAuthRouter from './routes/serviceProviderAuthRoutes.js';  // Service provider auth routes
import adminRouter from './routes/adminRoutes.js';


const app = express();
const port = process.env.PORT || 4000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());  // To parse JSON request body
app.use(cookieParser());  // To parse cookies
app.use(cors({ credentials: true }));  // Enable cross-origin resource sharing with credentials

// API Endpoints
app.get('/', (req, res) => res.send("API Working"));

// Regular user authentication routes
app.use('/api/auth', authRouter);


app.use('/api/admin/auth', adminRouter);

// Service provider authentication routes
app.use('/api/serviceProvider/auth', serviceProviderAuthRouter);

// Static file serving (for uploaded files)
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
