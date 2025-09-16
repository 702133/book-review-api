const Review = require("../models/Review");

exports.addReview = async (req, res) => {
  try {
    const { id } = req.params; // bookId
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const existingReview = await Review.findOne({ book: id, user: userId });
    if (existingReview) return res.status(400).json({ message: "You already reviewed this book" });

    const review = new Review({ rating, comment, book: id, user: userId });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

    await review.remove();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};