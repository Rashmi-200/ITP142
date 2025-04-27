import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import userModel from "./models/userModel.js"; // Adjust path to your user model

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL); // your MongoDB URL

    const existingAdmin = await userModel.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10); // you can change the password
    const admin = new userModel({
      fullName: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      phone: "0112345678",
      address: "Admin HQ",
      role: "admin",
      isAccountVerified: true
    });

    await admin.save();
    console.log(" Admin user created successfully");
    process.exit();
  } catch (error) {
    console.error(" Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
