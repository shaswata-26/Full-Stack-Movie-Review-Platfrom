import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const formatGenres = (genres) => {
    if (!genres || genres.length === 0) return 'No genres';
    return genres.slice(0, 2).join(', ') + (genres.length > 2 ? '...' : '');
  };

  return (
    <div className="movie-card">
      <Link to={`/movies/${movie._id}`} className="movie-card-link">
        <div className="movie-card-image">
          <img
            src={movie.posterUrl || '/default-movie.jpg'}
            alt={movie.title}
            onError={(e) => {
              e.target.src = '/default-movie.jpg';
            }}
          />
          <div className="movie-card-overlay">
            <div className="movie-rating">
              <RatingStars rating={movie.averageRating} size="small" />
              <span className="rating-text">{movie.averageRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="movie-card-content">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-year">{movie.releaseYear}</p>
          <p className="movie-genres">{formatGenres(movie.genre)}</p>
          <p className="movie-director">Director: {movie.director}</p>
          
          <div className="movie-stats">
            <span className="review-count">
              {movie.reviewCount} review{movie.reviewCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;