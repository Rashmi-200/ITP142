import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    rating: {
      type: Number,
    },
    reviewText: { type: String },
    serviceProvider: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    category: {
      type: String,
      enum: ["Cleaning", "Plumbing", "Electrical", "Painting", "Repair"],
    },
    images: [String],
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;