import serviceProviderModel from '../models/serProModel.js';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Verify Certification (Admin Only)
export const verifyCertification = async (req, res) => {
    const { providerId } = req.params;
    const { isVerified } = req.body;  // Boolean input from Admin

    try {
        const serviceProvider = await serviceProviderModel.findById(providerId);

        if (!serviceProvider) {
            return res.status(404).json({ success: false, message: 'Service provider not found' });
        }

        serviceProvider.isCertificationVerified = isVerified;  //  Corrected Field Name
        await serviceProvider.save();

        return res.status(200).json({ success: true, message: 'Certification verification updated successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
