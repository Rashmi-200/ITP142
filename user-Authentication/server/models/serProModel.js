import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema({
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
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        default: "service_provider"
     },
    serviceType: { 
        type: String, 
        required: true 
    },
    experience: { 
        type: Number, 
        required: true 
    },
    availability: [{
        day: { type: String, required: true }, // e.g., "Monday"
        startTime: { type: String, required: true }, // e.g., "09:00 AM"
        endTime: { type: String, required: true } // e.g., "06:00 PM"
    }],
    certificationProofs: [{ type: String }], // Array of file/image URLs for certification proof
    certificationPending: {
         type: Boolean, 
         default: true 
        },  
    isCertificationVerified: { 
        type: Boolean, 
        default: false 
    },  // Certification verification status
    verifyOtp: { 
        type: String,
         default: '' 
        },
    verifyOtpExpireAt: {
         type: Date,
          default: 0 },
    isAccountVerified: { 
        type: Boolean,
         default: false 
        },
    status: { 
        type: String, 
        enum: ['pending', 'verified', 'rejected'], default: 'pending' 
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

const serviceProviderModel = mongoose.models.serviceProvider || mongoose.model("serviceProvider", serviceProviderSchema);
export default serviceProviderModel;