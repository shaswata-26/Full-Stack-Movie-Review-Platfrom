import React from 'react';
import ReviewCard from './ReviewCard';
import LoadingSpinner from '../common/LoadingSpinner/LoadingSpinner';
import Pagination from '../common/Pagination/Pagination';
import './ReviewList.css';

const ReviewList = ({ 
  reviews, 
  loading, 
  error, 
  currentPage, 
  totalPages, 
  totalReviews,
  onPageChange,
  onEditReview,
  onDeleteReview,
  currentUserId 
}) => {
  if (loading) {
    return (
      <div className="review-list-container">
        <div className="review-list-loading">
          <LoadingSpinner message="Loading reviews..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-list-container">
        <div className="review-list-error">
          <h3>Error Loading Reviews</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="review-list-container">
        <div className="review-list-empty">
          <h3>No Reviews Yet</h3>
          <p>Be the first to share your thoughts about this movie!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-list-container">
      <div className="review-list-header">
        <h3 className="review-list-title">
          Reviews ({totalReviews})
        </h3>
      </div>

      <div className="reviews-grid">
        {reviews.map(review => (
          <ReviewCard
            key={review._id}
            review={review}
            onEdit={onEditReview}
            onDelete={onDeleteReview}
            canEdit={currentUserId === review.userId._id}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="review-pagination"
        />
      )}
    </div>
  );
};

export default ReviewList;