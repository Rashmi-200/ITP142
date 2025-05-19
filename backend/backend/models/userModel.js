import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String,
         required: true 
        },
    address: {
         type: String 
        },
    role: { 
        type: String,
         default: "user" 
        }, // Can be "user" or "admin"
    verifyOtp: {
        type: String, 
        default: ''
    },
    verifyOtpExpireAt: {
        type: Number, 
        default: 0
    },
    isAccountVerified: {
        type: Boolean, 
        default: false
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpireAt: {
        type: Number, 
        default: 0
    },
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
