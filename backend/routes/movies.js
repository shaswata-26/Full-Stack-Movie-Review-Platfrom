const express = require('express');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieReviews
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getMovies)
  .post(protect, admin, createMovie);

router.route('/:id')
  .get(getMovie)
  .put(protect, admin, updateMovie)
  .delete(protect, admin, deleteMovie);

router.route('/:id/reviews')
  .get(getMovieReviews);

module.exports = router;