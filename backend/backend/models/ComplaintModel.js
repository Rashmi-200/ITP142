import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    complaintid: {
        type: String,
        default: function() {
            // Generate a complaint ID with format COMP-YYMM-randomNumber
            const date = new Date();
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return `COMP-${year}${month}-${random}`;
        },
    },
    serviceName: {
        type: String,
    },
    serviceProvider: {
        type: String,
    },
    date: {
        type: Date,
    },
    location: {
        type: String,
    },
    bookingId: {
        type: String,
    },
    contactnumber: {
        type: Number,
    },
    complaintCategory: {
        type: String,
    },
    urgencyLevel: {
        type: String,
    },
    description: {
        type: String,
    },
    Status: {
        type: String,
        enum: ["In Progress", "Completed"],
        default: "In Progress"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;