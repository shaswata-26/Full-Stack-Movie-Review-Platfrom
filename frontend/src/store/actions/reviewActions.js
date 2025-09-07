import {
  GET_REVIEWS,
  GET_REVIEW,
  ADD_REVIEW,
  UPDATE_REVIEW,
  DELETE_REVIEW,
  REVIEW_ERROR,
  CLEAR_REVIEWS,
  CLEAR_CURRENT_REVIEW
} from './types';
import { reviewsAPI ,moviesAPI,usersAPI} from '../../services/api';
import { getMovie } from './movieActions';

// Get reviews for a movie
export const getMovieReviews = (movieId, params = {}) => async (dispatch) => {
  try {
    const res = await moviesAPI.getMovieReviews(movieId, params);
    
    dispatch({
      type: GET_REVIEWS,
      payload: {
        reviews: res.data.reviews,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalReviews: res.data.totalReviews,
        movieId
      }
    });
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: err.response?.data?.message || 'Error fetching reviews'
    });
  }
};

// Get reviews by user
export const getUserReviews = (userId, params = {}) => async (dispatch) => {
  try {
    const res = await usersAPI.getUserReviews(userId, params);
    
    dispatch({
      type: GET_REVIEWS,
      payload: {
        reviews: res.data.reviews,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalReviews: res.data.totalReviews,
        userId
      }
    });
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: err.response?.data?.message || 'Error fetching user reviews'
    });
  }
};

// Add review
export const addReview = (movieId, reviewData) => async (dispatch) => {
  try {
    const res = await reviewsAPI.createReview(movieId, reviewData);
    
    dispatch({
      type: ADD_REVIEW,
      payload: res.data
    });
    
    // Refresh movie to update average rating
    dispatch(getMovie(movieId));
    
    return res.data;
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: err.response?.data?.message || 'Error adding review'
    });
    throw err;
  }
};

// Update review
export const updateReview = (reviewId, reviewData) => async (dispatch) => {
  try {
    const res = await reviewsAPI.updateReview(reviewId, reviewData);
    
    dispatch({
      type: UPDATE_REVIEW,
      payload: res.data
    });
    
    // Refresh movie to update average rating
    const movieId = res.data.movieId;
    dispatch(getMovie(movieId));
    
    return res.data;
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: err.response?.data?.message || 'Error updating review'
    });
    throw err;
  }
};

// Delete review
export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    // First get the review to know which movie it belongs to
    const review = await reviewsAPI.getReview(reviewId);
    const movieId = review.data.movieId;
    
    await reviewsAPI.deleteReview(reviewId);
    
    dispatch({
      type: DELETE_REVIEW,
      payload: reviewId
    });
    
    // Refresh movie to update average rating
    dispatch(getMovie(movieId));
    
    // Refresh reviews list
    dispatch(getMovieReviews(movieId));
  } catch (err) {
    dispatch({
      type: REVIEW_ERROR,
      payload: err.response?.data?.message || 'Error deleting review'
    });
    throw err;
  }
};

// Clear reviews
export const clearReviews = () => (dispatch) => {
  dispatch({ type: CLEAR_REVIEWS });
};

// Clear current review
export const clearCurrentReview = () => (dispatch) => {
  dispatch({ type: CLEAR_CURRENT_REVIEW });
};