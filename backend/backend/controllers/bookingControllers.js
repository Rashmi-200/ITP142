import { Booking, ProviderAvailability } from '../models/BookingModel.js';
import { sendEmail } from '../helpers/emailHelper.js';

const maskCardNumber = (cardNumber) => {
    return cardNumber.replace(/\d{4}(?=\d{8})/g, "**** ****");
};

const createBooking = async (req, res) => {
    try {
        const { customerName, email, phone, address, startTime, endTime, serviceType, provider, date, cardNumber } = req.body;

        if (startTime >= endTime) {
            return res.status(400).json({ error: "Invalid time range. End time must be after start time." });
        }

        const totalHours = endTime - startTime;

        const existingBooking = await ProviderAvailability.findOne({
            provider,
            serviceType,
            "bookedSlots.date": date,
            "bookedSlots.startTime": { $lt: endTime },
            "bookedSlots.endTime": { $gt: startTime }
        });

        if (existingBooking) {
            return res.status(400).json({ error: "Provider is already booked for this time slot." });
        }

        let pricePerHour = 0;
        switch (serviceType.toLowerCase()) {
            case 'cleaning':
                pricePerHour = 1100;
                break;
            case 'plumbing':
                pricePerHour = 1600;
                break;
            case 'painting':
                pricePerHour = 1800;
                break;
            case 'repairing':
                pricePerHour = 1200;
                break;
            case 'electrician':
                pricePerHour = 1700;
                break;
            default:
                pricePerHour = 1000;
        }

        const totalPrice = totalHours * pricePerHour;
        const maskedCard = cardNumber ? maskCardNumber(cardNumber) : "";

        const booking = new Booking({
            customerName,
            email,
            phone,
            address,
            serviceType,
            provider,
            date,
            startTime,
            endTime,
            totalHours,
            price: totalPrice,
            cardNumberMasked: maskedCard,
            paymentStatus: "Paid"
        });

        await booking.save();

        await ProviderAvailability.findOneAndUpdate(
            { provider, serviceType },
            { $push: { bookedSlots: { date, startTime, endTime } } },
            { upsert: true }
        );

        await sendEmail(email, "Booking Confirmation", `
            <h2>Booking Confirmed</h2>
            <p>Your booking for <strong>${serviceType}</strong> with <strong>${provider}</strong> is confirmed.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${startTime}:00 - ${endTime}:00 (${totalHours} hours)</p>
            <p><strong>Total Price:</strong> LKR ${totalPrice}</p>
        `);

        res.status(201).json({ message: "Booking created successfully", booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProviderAvailability = async (req, res) => {
    try {
        const { provider, serviceType, date } = req.query;

        const availability = await ProviderAvailability.findOne({ provider, serviceType });
        if (!availability) return res.json([]);

        const slotsForDate = availability.bookedSlots.filter(slot => slot.date === date);
        res.json(slotsForDate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const { startTime, endTime, serviceType, provider, email, date } = req.body;

        if (startTime >= endTime) {
            return res.status(400).json({ error: "Invalid time range. End time must be after start time." });
        }

        const totalHours = endTime - startTime;

        let pricePerHour = 0;
        switch (serviceType.toLowerCase()) {
            case 'cleaning':
                pricePerHour = 1100;
                break;
            case 'plumbing':
                pricePerHour = 1600;
                break;
            case 'painting':
                pricePerHour = 1800;
                break;
            case 'repairing':
                pricePerHour = 1200;
                break;
            case 'electrician':
                pricePerHour = 1700;
                break;
            default:
                pricePerHour = 1000;
        }

        const newPrice = totalHours * pricePerHour;

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { ...req.body, totalHours, price: newPrice },
            { new: true }
        );

        await sendEmail(email, "Booking Updated", `
            <h2>Booking Updated</h2>
            <p>Your booking has been updated successfully.</p>
            <p><strong>New Date:</strong> ${date}</p>
            <p><strong>New Time:</strong> ${startTime}:00 - ${endTime}:00 (${totalHours} hours)</p>
            <p><strong>Total Price:</strong> LKR ${newPrice}</p>
        `);

        res.json({ message: "Booking updated successfully", updatedBooking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await ProviderAvailability.findOneAndUpdate(
            { provider: booking.provider, serviceType: booking.serviceType },
            {
                $pull: {
                    bookedSlots: {
                        date: booking.date,
                        startTime: booking.startTime,
                        endTime: booking.endTime
                    }
                }
            }
        );

        await sendEmail(
            booking.email,
            "Booking Cancelled",
            `<h2>Your Booking Has Been Cancelled</h2>
             <p><strong>${booking.serviceType}</strong> with <strong>${booking.provider}</strong></p>
             <p><strong>Date:</strong> ${booking.date}</p>
             <p><strong>Time:</strong> ${booking.startTime}:00 to ${booking.endTime}:00</p>`
        );

        res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBookingsByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const bookings = await Booking.find({ email }).sort({ date: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    createBooking,
    getAllBookings,
    getBookingById,
    getProviderAvailability,
    updateBooking,
    deleteBooking,
    getBookingsByEmail
};
