import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  serviceType: { type: String, required: true },
  provider: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: Number, required: true }, 
  endTime: { type: Number, required: true },   
  totalHours: { type: Number, required: true },
  price: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  cardNumberMasked: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const providerAvailabilitySchema = new mongoose.Schema({
  provider: { type: String, required: true },
  serviceType: { type: String, required: true },
  bookedSlots: [
    {
      date: { type: String, required: true },
      startTime: { type: Number, required: true }, 
      endTime: { type: Number, required: true }   
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);
const ProviderAvailability = mongoose.model('ProviderAvailability', providerAvailabilitySchema);

export { Booking, ProviderAvailability };
