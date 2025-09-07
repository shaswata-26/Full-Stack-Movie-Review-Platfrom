const express = require('express');
const { body } = require('express-validator');
const {
  getUserProfile,
  updateUserProfile,
  getUserReviews,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('username')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .isAlphanumeric()
    .withMessage('Username can only contain letters and numbers'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Routes
router.route('/:id')
  .get(getUserProfile)
  .put(protect, updateProfileValidation, handleValidationErrors, updateUserProfile);

router.route('/:id/reviews')
  .get(getUserReviews);

router.route('/:id/watchlist')
  .get(protect, getWatchlist)
  .post(protect, addToWatchlist);

router.route('/:id/watchlist/:movieId')
  .delete(protect, removeFromWatchlist);

module.exports = router;