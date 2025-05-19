import Review from "../models/reviewsModel.js";

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { name, email, rating, reviewText, serviceProvider, category, images } = req.body;

    const review = new Review({
      name,
      email,
      rating,
      reviewText,
      serviceProvider,
      category,
      images,
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET ALL APPROVED REVIEWS
export const getAllApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET REVIEWS BY SERVICE PROVIDER
export const getReviewsByServiceProvider = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;
    const reviews = await Review.find({ serviceProvider: serviceProviderId, status: "approved" });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET REVIEW BY ID
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET REVIEW BY EMAIL
export const getOneReviewByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const review = await Review.findOne({ email });
    if (!review) return res.status(404).json({ message: "Review not found for this email" });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE REVIEW
export const updateReview = async (req, res) => {
  try {
    const { name, email, rating, reviewText, serviceProvider, category, images, status } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { name, email, rating, reviewText, serviceProvider, category, images, status },
      { new: true, runValidators: true }
    );

    if (!updatedReview) return res.status(404).json({ message: "Review not found" });

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE REVIEW
export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CHANGE REVIEW STATUS (ADMIN ACTION)
export const changeReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
