import express from 'express';
import { 
  registerServiceProvider, 
  loginServiceProvider, 
  logoutServiceProvider, 
  uploadCertification, 
  verifyCertification, 
  sendResetOtp, 
  resetPassword, 
  sendVerifyOtpForServiceProvider,
  verifyEmailForServiceProvider,
  updateServiceProvider,  // Added update function
  deleteServiceProvider,  // Added delete function
  getAllServiceProviders, // New
  toggleServiceProviderStatus, // New
  downloadServiceProviderReport, // New
  getServiceProvider, // Add this line
  getProfileCertifications
} from '../controllers/serviceProviderAuthController.js';
import { protect } from '../middlewares/authMiddleware.js';  // Authentication middleware
import upload from '../middlewares/fileUpload.js';  // File upload middleware
import { isAuthenticated } from '../controllers/authController.js';

const router = express.Router();

//  Register a new service provider
router.post('/register', registerServiceProvider);

//  Login for service providers
router.post('/login', loginServiceProvider);

//  Logout service provider
router.post('/logout', logoutServiceProvider);

//  Check if authenticated
router.post('/is-auth', protect, isAuthenticated);

//  Send email verification OTP
router.post('/send-verify-otp', sendVerifyOtpForServiceProvider);

// Route to verify OTP
router.post('/verify-email', verifyEmailForServiceProvider);

//  Upload certification (Protected + File Upload Middleware)
router.post('/upload-certifications', protect, upload.single('certification'), uploadCertification);
router.get('/certifications', protect, getProfileCertifications);


//  Admin verification of certification
router.post('/verify-certification/:id', protect, verifyCertification);

//  Send password reset OTP
router.post('/send-reset-otp', sendResetOtp);

//  Reset password
router.post('/reset-password', resetPassword);

//  Update service provider details
router.put('/update/:userId', protect, updateServiceProvider);  // Updated route for update

//  Delete a service provider
router.delete('/delete/:userId', deleteServiceProvider); // No protect

//  Fetch a single service provider
router.get('/data/:serviceProviderId', protect, getServiceProvider); // Added protect

//  Fetch all service providers
router.get('/all', getAllServiceProviders); // No protect

//  Toggle service provider status
router.put('/toggle-status/:id', toggleServiceProviderStatus); // No protect

//  Download service provider report
router.get('/report', downloadServiceProviderReport); // No protect

export default router;