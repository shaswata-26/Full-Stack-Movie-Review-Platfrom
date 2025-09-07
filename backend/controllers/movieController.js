const Movie = require('../models/Movie');
const Review = require('../models/Review');

// Get all movies with pagination and filtering
const getMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.genre) filter.genre = { $in: [req.query.genre] };
    if (req.query.year) filter.releaseYear = parseInt(req.query.year);
    if (req.query.minRating) filter.averageRating = { $gte: parseFloat(req.query.minRating) };
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { director: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const movies = await Movie.find(filter)
      .sort({ averageRating: -1, title: 1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Movie.countDocuments(filter);
    
    res.json({
      movies,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMovies: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single movie
const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create movie (admin only)
const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update movie (admin only)
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete movie (admin only)
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Also delete all reviews for this movie
    await Review.deleteMany({ movieId: req.params.id });
    
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get movie reviews
const getMovieReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ movieId: req.params.id })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments({ movieId: req.params.id });
    
    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieReviews
};