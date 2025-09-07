const Review = require('../models/Review');
const Movie = require('../models/Movie');

// Create review
const createReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const movieId = req.params.id;
    const userId = req.user._id;
    
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({ userId, movieId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }
    
    // Create review
    const review = new Review({
      userId,
      movieId,
      rating,
      reviewText
    });
    
    const createdReview = await review.save();
    
    // Update movie rating
    const reviews = await Review.find({ movieId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await Movie.findByIdAndUpdate(movieId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviews.length
    });
    
    // Populate user data
    await createdReview.populate('userId', 'username avatar');
    
    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    review.rating = rating;
    review.reviewText = reviewText;
    
    const updatedReview = await review.save();
    
    // Update movie rating
    const reviews = await Review.find({ movieId: review.movieId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await Movie.findByIdAndUpdate(review.movieId, {
      averageRating: parseFloat(averageRating.toFixed(1))
    });
    
    await updatedReview.populate('userId', 'username avatar');
    
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns the review or is admin
    if (review.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const movieId = review.movieId;
    await Review.findByIdAndDelete(req.params.reviewId);
    
    // Update movie rating
    const reviews = await Review.find({ movieId });
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
    
    await Movie.findByIdAndUpdate(movieId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviews.length
    });
    
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview
};