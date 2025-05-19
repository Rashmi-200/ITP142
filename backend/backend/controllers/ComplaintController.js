import Complaint from "../models/ComplaintModel.js";

// Get All Complaints
export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();
        if (!complaints || complaints.length === 0) {
            return res.status(404).json({ message: "No complaints found" });
        }
        res.status(200).json({ complaints });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Add a Complaint
export const addComplaints = async (req, res) => {
    const { complaintid, serviceName, serviceProvider, date, location, bookingId, contactnumber, complaintCategory, urgencyLevel, description } = req.body;

    try {
        const newComplaint = new Complaint({ complaintid, serviceName, serviceProvider, date, location, bookingId, contactnumber, complaintCategory, urgencyLevel, description });
        await newComplaint.save();
        res.status(201).json({ newComplaint });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Unable to add complaint" });
    }
};

// Get Complaint by ID
export const getById = async (req, res) => {
    const id = req.params.id;
    try {
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        res.status(200).json({ complaint });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update Complaint
export const updateComplaint = async (req, res) => {
    const id = req.params.id;
    const { complaintid, serviceName, serviceProvider, date, location, bookingId, contactnumber, complaintCategory, urgencyLevel, description, Status } = req.body;

    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { complaintid, serviceName, serviceProvider, date, location, bookingId, contactnumber, complaintCategory, urgencyLevel, description, Status },
            { new: true }
        );
        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        res.status(200).json({ updatedComplaint });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Complaint
export const deleteComplaint = async (req, res) => {
    const id = req.params.id;
    try {
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        await Complaint.findByIdAndDelete(id);
        res.status(200).json({ message: "Complaint deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
