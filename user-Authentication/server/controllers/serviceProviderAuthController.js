import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import serviceProviderModel from '../models/serProModel.js';
import transporter from '../config/nodemailer.js';

//  Register a new service provider
export const registerServiceProvider = async (req, res) => {
    const { fullName, email, password, phone, address, serviceType, experience } = req.body;
    console.log("Service Provider Registration");
    console.log(req.body);
  
    // Validate required fields (excluding certifications)
    if (!fullName || !email || !password || !phone || !address || !serviceType || !experience) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address format' });
    }
  
    // Validate phone number (only digits, length 10-15)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number. Only digits allowed, length 10-15.' });
    }
  
    // Determine certification proofs; make it optional
    let certificationProofs = [];
    if (req.file) {
      certificationProofs.push(`/uploads/certifications/${req.file.filename}`);
    } else if (req.body.certificationProofs) {
      // Accept either an array or a single certification URL provided in JSON
      certificationProofs = Array.isArray(req.body.certificationProofs)
        ? req.body.certificationProofs
        : [req.body.certificationProofs];
    }
  
    try {
      const existingServiceProvider = await serviceProviderModel.findOne({ email });
      if (existingServiceProvider) {
        return res.status(409).json({ success: false, message: 'Service provider already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const serviceProvider = new serviceProviderModel({
        fullName,
        email,
        phone,
        address,
        serviceType,
        experience,
        password: hashedPassword,
        certificationProofs // Optional; empty array if no certifications provided
      });
  
      await serviceProvider.save();
      const token = jwt.sign({ id: serviceProvider._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      // Sending welcome email
      const mailOptions = {
        from: "rashmijayawardena19@gmail.com",
        to: email,
        subject: 'Welcome to SmartHomeCare',
        text: `Welcome to SmartHomeCare! Your account has been created successfully.`,
      };
  
      await transporter.sendMail(mailOptions);
      return res.status(201).json({ success: true, message: 'Registration successful', token });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

//  Login for service providers
export const loginServiceProvider = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const serviceProvider = await serviceProviderModel.findOne({ email });

        if (!serviceProvider || !(await bcrypt.compare(password, serviceProvider.password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: serviceProvider._id, userType: 'serviceProvider' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({ success: true, message: 'Login successful', token, userType: 'serviceProvider' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//  Logout service provider
export const logoutServiceProvider = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



// Send verification OTP to the Service Provider's email
export const sendVerifyOtpForServiceProvider = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const serviceProviderId = decoded.id;

        const serviceProvider = await serviceProviderModel.findById(serviceProviderId);

        if (!serviceProvider) {
            return res.status(404).json({ success: false, message: 'Service provider not found' });
        }

        if (serviceProvider.isAccountVerified) {
            return res.status(400).json({ success: false, message: 'Account already verified' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        serviceProvider.verifyOtp = otp;
        serviceProvider.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await serviceProvider.save();

        if (!serviceProvider.email) {
            return res.status(400).json({ success: false, message: 'Email address is missing' });
        }

        const mailOptions = {
            from: "rashmijayawardena19@gmail.com",
            to: serviceProvider.email,
            subject: 'Account verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Verification OTP sent on Email' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//verifyEmail
export const verifyEmailForServiceProvider = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ success: false, message: "Missing OTP" });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const providerId = decoded.id;

        const serviceProvider = await serviceProviderModel.findById(providerId);

        if (!serviceProvider) {
            return res.status(404).json({ success: false, message: "Service Provider not found" });
        }

        if (serviceProvider.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (serviceProvider.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        serviceProvider.isAccountVerified = true;
        serviceProvider.verifyOtp = '';
        serviceProvider.verifyOtpExpireAt = null;

        await serviceProvider.save();

        return res.json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};




//  Upload Certification
export const uploadCertification = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const serviceProvider = await serviceProviderModel.findById(req.user._id);

        if (!serviceProvider) {
            return res.status(404).json({ success: false, message: 'Service provider not found' });
        }

        serviceProvider.certificationProofs.push(`/uploads/certifications/${req.file.filename}`);
        serviceProvider.isCertificationVerified = false;
        serviceProvider.certificationPending = true;

        await serviceProvider.save();

        return res.status(200).json({ success: true, message: 'Certification uploaded successfully. Awaiting verification.', certificationUrl: `/uploads/certifications/${req.file.filename}` });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//  Verify Certification
export const verifyCertification = async (req, res) => {
    try {
        const serviceProvider = await serviceProviderModel.findById(req.params.id);

        if (!serviceProvider) {
            return res.status(404).json({ success: false, message: 'Service provider not found' });
        }

        serviceProvider.isCertificationVerified = true;
        serviceProvider.certificationPending = false;

        await serviceProvider.save();

        return res.status(200).json({ success: true, message: 'Certification verified successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//  Update Service Provider
export const updateServiceProvider = async (req, res) => {
    const { userId } = req.params;
    const { fullName, phone, address, serviceType, experience } = req.body;

    try {
        const updatedServiceProvider = await serviceProviderModel.findByIdAndUpdate(
            userId,
            { fullName, phone, address, serviceType, experience },
            { new: true } // Return the updated document
        );

        if (!updatedServiceProvider) {
            return res.status(404).json({ success: false, message: 'Service provider not found' });
        }

        return res.status(200).json({ success: true, message: 'Service provider updated successfully', updatedServiceProvider });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//  Delete Service Provider
export const deleteServiceProvider = async (req, res) => {
    const { userId } = req.params;

    try {
        const deletedServiceProvider = await serviceProviderModel.findByIdAndDelete(userId);

        if (!deletedServiceProvider) {
            return res.status(404).json({ success: false, message: 'Service provider not found' });
        }

        return res.status(200).json({ success: true, message: 'Service provider deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


//  Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        const serviceProvider = await serviceProviderModel.findOne({ email });

        if (!serviceProvider) {
            return res.status(404).json({ success: false, message: 'Service provider not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        serviceProvider.resetOtp = otp;
        serviceProvider.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 min expiry

        await serviceProvider.save();

        const mailOptions = {
            from: "rashmijayawardena19@gmail.com",
            to: serviceProvider.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}.`,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//  Reset Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const serviceProvider = await serviceProviderModel.findOne({ email });

        if (!serviceProvider || serviceProvider.resetOtp !== otp || serviceProvider.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        serviceProvider.password = await bcrypt.hash(newPassword, 10);
        serviceProvider.resetOtp = '';
        serviceProvider.resetOtpExpireAt = 0;

        await serviceProvider.save();

        return res.json({ success: true, message: 'Password reset successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


//  Get all service providers (Updated)
export const getAllServiceProviders = async (req, res) => {
    try {
      const serviceProviders = await serviceProviderModel.find();
  
      if (!serviceProviders || serviceProviders.length === 0) {
        return res.status(404).json({ success: false, message: 'No service providers found' });
      }
  
      const serviceProviderData = serviceProviders.map(provider => ({
        id: provider._id,
        fullName: provider.fullName,
        email: provider.email,
        phone: provider.phone,
        address: provider.address,
        serviceType: provider.serviceType,
        experience: provider.experience,
        availability: provider.availability || [],
        certificationProofs: provider.certificationProofs || [],
        isCertificationVerified: provider.isCertificationVerified || false,
        isAccountVerified: provider.isAccountVerified || false,
        status: provider.status || 'pending',
      }));
  
      return res.status(200).json({
        success: true,
        message: 'Service providers retrieved successfully',
        serviceProviders: serviceProviderData,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  
  //  Toggle Service Provider Status
  export const toggleServiceProviderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
  
    try {
      const serviceProvider = await serviceProviderModel.findById(id);
      if (!serviceProvider) {
        return res.status(404).json({ success: false, message: 'Service provider not found' });
      }
  
      serviceProvider.status = status;
      serviceProvider.isAccountVerified = status === 'verified'; // Sync with isAccountVerified
      await serviceProvider.save();
  
      return res.status(200).json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  
  //  Download Service Provider Report (CSV)
  export const downloadServiceProviderReport = async (req, res) => {
    try {
      const serviceProviders = await serviceProviderModel.find();
  
      if (!serviceProviders || serviceProviders.length === 0) {
        return res.status(404).json({ success: false, message: 'No service providers found' });
      }
  
      // Create CSV content
      const csvHeader = 'ID,Full Name,Email,Phone,Address,Service Type,Experience,Status,Certification Verified\n';
      const csvRows = serviceProviders.map(provider => (
        `${provider._id},${provider.fullName},${provider.email},${provider.phone},${provider.address},${provider.serviceType},${provider.experience},${provider.status},${provider.isCertificationVerified ? 'Yes' : 'No'}`
      )).join('\n');
      const csvContent = csvHeader + csvRows;
  
      // Set response headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="service_providers_report.csv"');
  
      return res.status(200).send(csvContent);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  //  Get a single service provider by ID
export const getServiceProvider = async (req, res) => {
    try {
        const { serviceProviderId } = req.params; // Get serviceProviderId from URL parameters

        const serviceProvider = await serviceProviderModel.findById(serviceProviderId);

        if (!serviceProvider) {
            return res.status(404).json({ success: false, message: 'Service provider not found' });
        }

        // Return only the necessary service provider data
        const serviceProviderData = {
            id: serviceProvider._id,
            fullName: serviceProvider.fullName,
            email: serviceProvider.email,
            phone: serviceProvider.phone,
            address: serviceProvider.address,
            serviceType: serviceProvider.serviceType,
            experience: serviceProvider.experience,
            availability: serviceProvider.availability || [],
            certificationProofs: serviceProvider.certificationProofs || [],
            isCertificationVerified: serviceProvider.isCertificationVerified || false,
            isAccountVerified: serviceProvider.isAccountVerified || false,
            status: serviceProvider.status || 'pending',
        };

        return res.status(200).json({
            success: true,
            message: 'Service provider retrieved successfully',
            serviceProvider: serviceProviderData,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all certifications for profile display
export const getProfileCertifications = async (req, res) => {
    try {
        const serviceProvider = await serviceProviderModel.findById(req.user._id)
            .select('certificationProofs isCertificationVerified certificationPending');

        if (!serviceProvider) {
            return res.status(404).json({ success: false, message: 'Service provider not found' });
        }

        return res.status(200).json({
            success: true,
            certifications: serviceProvider.certificationProofs,
            verificationStatus: {
                isVerified: serviceProvider.isCertificationVerified,
                isPending: serviceProvider.certificationPending
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
