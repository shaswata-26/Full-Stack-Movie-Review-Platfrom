import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import RatingStars from '../movie/RatingStars';
import './ReviewCard.css';

const ReviewCard = ({ review, onEdit, onDelete, canEdit = false }) => {
  const { user } = useSelector(state => state.auth);
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = () => {
    setShowActions(false);
    onEdit(review);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsDeleting(true);
      try {
        await onDelete(review._id);
      } catch (error) {
        console.error('Error deleting review:', error);
      } finally {
        setIsDeleting(false);
        setShowActions(false);
      }
    }
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.userId.avatar ? (
              <img 
                src={review.userId.avatar} 
                alt={review.userId.username}
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
            ) : (
              <div className="avatar-placeholder">
                {review.userId.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="reviewer-details">
            <h4 className="reviewer-name">{review.userId.username}</h4>
            <span className="review-date">{formatDate(review.createdAt)}</span>
          </div>
        </div>

        {canEdit && (
          <div className="review-actions">
            <button
              className="actions-toggle"
              onClick={() => setShowActions(!showActions)}
              aria-label="Review actions"
            >
              ⋮
            </button>
            
            {showActions && (
              <div className="actions-menu">
                <button
                  onClick={handleEdit}
                  className="action-btn edit-btn"
                  disabled={isDeleting}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="action-btn delete-btn"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="review-rating">
        <RatingStars rating={review.rating} size="small" />
        <span className="rating-value">{review.rating.toFixed(1)}/5</span>
      </div>

      <div className="review-content">
        <p className="review-text">{review.reviewText}</p>
      </div>

      {review.updatedAt !== review.createdAt && (
        <div className="review-updated">
          <small>Edited on {formatDate(review.updatedAt)}</small>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;