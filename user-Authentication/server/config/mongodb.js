import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Ensure .env variables are loaded

const connectDB = async () => {
    try {
        // MongoDB connection string is usually provided without appending the database name in this manner.
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            w: 'majority',  // Ensure write concern is set to majority
        });

        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;
