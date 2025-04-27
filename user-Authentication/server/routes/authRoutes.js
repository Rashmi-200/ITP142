import express from 'express';
import { 
    isAuthenticated, 
    login, 
    logout, 
    register, 
    resetPassword, 
    sendResetOtp, 
    sendVerifyOtp, 
    verifyEmail, 
    updateUser, 
    deleteUser,
    getUser, 
    getAllUsers,
    
} from '../controllers/authController.js';
import { protect as userAuth } from '../middlewares/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/is-auth', userAuth, isAuthenticated);


authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.get('/users/data/:userId', userAuth, getUser); // Fetch a single user
authRouter.get('/users/all', userAuth, getAllUsers); // Fetch all users


// New routes for updating and deleting a user
authRouter.put('/update-user/:userId', userAuth, updateUser);

authRouter.delete('/delete-user/:userId', userAuth, deleteUser);

export { authRouter };