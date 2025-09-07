const express = require('express');
const { body } = require('express-validator');
const {
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review must be between 10 and 1000 characters')
];

// Routes
router.post('/:id', protect, reviewValidation, handleValidationErrors, createReview);
router.put('/:reviewId', protect, reviewValidation, handleValidationErrors, updateReview);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;