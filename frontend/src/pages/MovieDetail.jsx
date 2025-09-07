import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMovie} from '../store/actions/movieActions';
import { getMovieReviews } from '../store/actions/reviewActions';
import { addToWatchlist, removeFromWatchlist } from '../store/actions/userActions';
import ReviewForm from '../components/review/ReviewForm';
import ReviewList from '../components/review/ReviewList';
import RatingStars from '../components/movie/RatingStars';
import LoadingSpinner from '../components/common/LoadingSpinner/LoadingSpinner';
import './MovieDetails.css';

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { movie, loading: movieLoading } = useSelector(state => state.movies);
  const { reviews, loading: reviewsLoading, currentPage, totalPages, totalReviews } = useSelector(state => state.reviews);
  const { watchlist } = useSelector(state => state.users);
  
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getMovie(id));
      dispatch(getMovieReviews(id, { page: 1, limit: 10 }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (movie && watchlist) {
      const inWatchlist = watchlist.some(item => item._id === movie._id);
      setIsInWatchlist(inWatchlist);
    }
  }, [movie, watchlist]);

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      alert('Please login to manage your watchlist');
      return;
    }

    try {
      if (isInWatchlist) {
        await dispatch(removeFromWatchlist(user._id, movie._id));
      } else {
        await dispatch(addToWatchlist(user._id, movie._id));
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    // This would be handled by your review actions
    console.log('Review submitted:', reviewData);
    setShowReviewForm(false);
    setEditingReview(null);
    // Refresh reviews
    dispatch(getMovieReviews(id, { page: 1, limit: 10 }));
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    // This would be handled by your review actions
    console.log('Delete review:', reviewId);
    // Refresh reviews
    dispatch(getMovieReviews(id, { page: 1, limit: 10 }));
  };

  const handleReviewsPageChange = (page) => {
    dispatch(getMovieReviews(id, { page, limit: 10 }));
  };

  if (movieLoading) {
    return (
      <div className="movie-detail-page">
        <div className="loading-container">
          <LoadingSpinner message="Loading movie details..." />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-detail-page">
        <div className="error-container">
          <h2>Movie Not Found</h2>
          <p>The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      {/* Movie Header */}
      <div className="movie-header">
        <div className="movie-poster">
          <img
            src={movie.posterUrl || '/default-movie.jpg'}
            alt={movie.title}
            onError={(e) => {
              e.target.src = '/default-movie.jpg';
            }}
          />
        </div>
        
        <div className="movie-info">
          <h1 className="movie-title">{movie.title}</h1>
          <p className="movie-year">{movie.releaseYear}</p>
          
          <div className="movie-rating">
            <RatingStars rating={movie.averageRating} size="large" />
            <span className="rating-value">
              {movie.averageRating.toFixed(1)}/5 ({movie.reviewCount} reviews)
            </span>
          </div>
          
          <div className="movie-genres">
            {movie.genre.map(genre => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>
          
          <p className="movie-director">
            <strong>Director:</strong> {movie.director}
          </p>
          
          {movie.cast && movie.cast.length > 0 && (
            <p className="movie-cast">
              <strong>Cast:</strong> {movie.cast.slice(0, 5).join(', ')}
              {movie.cast.length > 5 && '...'}
            </p>
          )}
          
          <div className="movie-actions">
            <button
              onClick={handleWatchlistToggle}
              className={`watchlist-btn ${isInWatchlist ? 'in-watchlist' : ''}`}
            >
              {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
            </button>
            
            {isAuthenticated && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="review-btn"
              >
                {showReviewForm ? 'Cancel Review' : 'Write Review'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Movie Synopsis */}
      <div className="movie-synopsis">
        <h2>Synopsis</h2>
        <p>{movie.synopsis}</p>
      </div>

      {/* Trailer Section */}
      {movie.trailerUrl && (
        <div className="trailer-section">
          <h2>Trailer</h2>
          <div className="trailer-container">
            <iframe
              src={movie.trailerUrl}
              title={`${movie.title} Trailer`}
              allowFullScreen
              className="trailer-iframe"
            />
          </div>
        </div>
      )}

      {/* Review Form */}
      {(showReviewForm || editingReview) && (
        <div className="review-form-section">
          <ReviewForm
            movie={movie}
            review={editingReview}
            onSubmit={handleReviewSubmit}
            onCancel={() => {
              setShowReviewForm(false);
              setEditingReview(null);
            }}
          />
        </div>
      )}

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="section-header">
          <h2>Reviews ({totalReviews})</h2>
          {!isAuthenticated && (
            <p className="login-prompt">
              <a href="/login">Login</a> to write a review
            </p>
          )}
        </div>

        <ReviewList
          reviews={reviews}
          loading={reviewsLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalReviews={totalReviews}
          onPageChange={handleReviewsPageChange}
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
          currentUserId={user?._id}
        />
      </div>
    </div>
  );
};

export default MovieDetail;