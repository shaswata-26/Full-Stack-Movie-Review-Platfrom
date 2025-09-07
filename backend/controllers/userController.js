const User = require('../models/User');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.avatar = req.body.avatar || user.avatar;
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        joinDate: updatedUser.joinDate,
        token: req.headers.authorization.split(' ')[1]
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user reviews
const getUserReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ userId: req.params.id })
      .populate('movieId', 'title posterUrl releaseYear')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments({ userId: req.params.id });
    
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

// Get user watchlist
const getWatchlist = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const watchlist = await Watchlist.find({ userId: req.params.id })
      .populate('movieId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Watchlist.countDocuments({ userId: req.params.id });
    
    res.json({
      watchlist: watchlist.map(item => item.movieId),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Check if already in watchlist
    const alreadyInWatchlist = await Watchlist.findOne({
      userId: req.user._id,
      movieId
    });
    
    if (alreadyInWatchlist) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }
    
    const watchlistItem = new Watchlist({
      userId: req.user._id,
      movieId
    });
    
    const createdWatchlistItem = await watchlistItem.save();
    await createdWatchlistItem.populate('movieId');
    
    res.status(201).json(createdWatchlistItem.movieId);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const watchlistItem = await Watchlist.findOne({
      userId: req.user._id,
      movieId: req.params.movieId
    });
    
    if (!watchlistItem) {
      return res.status(404).json({ message: 'Movie not found in watchlist' });
    }
    
    await Watchlist.findByIdAndDelete(watchlistItem._id);
    
    res.json({ message: 'Movie removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserReviews,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
};