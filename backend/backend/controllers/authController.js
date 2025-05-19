import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
    const { fullName, email, password, phone } = req.body;

    // Basic field check
    if (!fullName || !email || !password || !phone) {
        return res.status(400).json({ success: false, message: 'Missing details' });
    }

    // Email validation (standard email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Phone number validation (digits only, no special characters or @ allowed)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ success: false, message: 'Invalid phone number. Only digits allowed.' });
    }

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ fullName, email, phone, password: hashedPassword });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Sending welcome email
        const mailOptions = {
            from: "rashmijayawardena19@gmail.com",
            to: email,
            subject: 'Welcome to SmartHomeCare',
            text: `Welcome to SmartHomeCare website. Your account has been created with email id: ${email}`,
        };

        console.log('User Email:', email);
        console.log('SMTP_USER:', process.env.SMTP_USER);
        console.log("Attempting to send verification email to:", email);

        try {
            await transporter.sendMail(mailOptions);
            console.log('Verification email sent to:', email);
        } catch (error) {
            console.error('Error sending verification email:', error);
        }

        return res.status(201).json({ success: true, message: 'User registered successfully', token });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, userType: 'customer' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ success: true, message: 'Login successful', token, userType: 'customer', email: user.email  });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.status(200).json({ success: true, message: 'Logged out successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


//  Get a single customer by ID
export const getUser = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from URL parameters

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Return only the necessary user data
        const userData = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address || '', // Include address if it exists
            isAccountVerified: user.isAccountVerified || false,
        };

        return res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            user: userData,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//  Get all customers
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: 'No users found' });
        }

        // Map the users to return only necessary data
        const userData = users.map(user => ({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address || '',
            isAccountVerified: user.isAccountVerified || false,
        }));

        return res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            users: userData,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Send verification OTP to the User's email


export const sendVerifyOtp = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: 'Account already verified' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        if (!user.email) {
            return res.status(400).json({ success: false, message: 'Email address is missing' });
        }

        const mailOptions = {
            from: "rashmijayawardena19@gmail.com",
            to: user.email,
            subject: 'Account verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Verification OTP sent on Email' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



export const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.json({ success: false, message: "Missing OTP" });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const isAuthenticated = async (req,res)=>{
    try {
        return res.json({success:true});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const updateUser = async (req, res) => {
    let { userId } = req.params;
    userId = userId.trim();  // Remove any leading/trailing whitespace or newline characters

    const { fullName, phone, address } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate(userId, { fullName, phone, address }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.json({ success: true, message: 'User updated successfully', user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteUser = async (req, res) => {
    let { userId } = req.params;
    userId = userId.replace(/[\n\r]+/g, '').trim();  // Remove newlines and trim whitespace

    try {
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




// send password reset otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiration

        await user.save();

        if (!user.email) {
            return res.status(400).json({ success: false, message: 'Email address is missing' });
        }

        const mailOptions = {
            from: "rashmijayawardena19@gmail.com",
            to: user.email,
            subject: 'Password reset OTP',
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'OTP sent to your email' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// Reset user password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    try {
        // Change from findById to findOne, querying by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
