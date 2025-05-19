import mongoose from 'mongoose';

const evidanceSchema = new mongoose.Schema({
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint', // Must match the Complaint model name
        required: true
    },
    photo: {
        type: String
    }
});

const Evidance = mongoose.model('Evidance', evidanceSchema);

export default Evidance;
