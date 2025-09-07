import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import RatingStars from '../movie/RatingStars';
import './ReviewForm.css';

const ReviewForm = ({ movie, review = null, onSubmit, onCancel, loading = false }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [rating, setRating] = useState(review ? review.rating : 0);
  const [reviewText, setReviewText] = useState(review ? review.reviewText : '');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!reviewText.trim()) {
      newErrors.reviewText = 'Review text is required';
    } else if (reviewText.trim().length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters long';
    } else if (reviewText.trim().length > 1000) {
      newErrors.reviewText = 'Review cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      rating,
      reviewText: reviewText.trim()
    });
  };

  const handleCancel = () => {
    setRating(review ? review.rating : 0);
    setReviewText(review ? review.reviewText : '');
    setErrors({});
    if (onCancel) onCancel();
  };

  if (!isAuthenticated) {
    return (
      <div className="review-form-notice">
        <p>Please <a href="/login">login</a> to write a review.</p>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <h3 className="review-form-title">
        {review ? 'Edit Your Review' : `Write a Review for ${movie?.title}`}
      </h3>
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label className="form-label">Your Rating *</label>
          <RatingStars
            rating={rating}
            changeRating={setRating}
            starDimension="28px"
            starSpacing="3px"
          />
          {errors.rating && <span className="error-message">{errors.rating}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reviewText" className="form-label">
            Your Review * ({reviewText.length}/1000 characters)
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            className={`form-textarea ${errors.reviewText ? 'error' : ''}`}
            rows="6"
            maxLength="1000"
          />
          {errors.reviewText && <span className="error-message">{errors.reviewText}</span>}
        </div>

        <div className="form-actions">
          {review && (
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || rating === 0 || !reviewText.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {review ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              review ? 'Update Review' : 'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;