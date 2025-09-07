import React from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from '../common/LoadingSpinner/LoadingSpinner';
import './MovieList.css';

const MovieList = ({ movies, loading, error, title = "Movies", emptyMessage = "No movies found" }) => {
  if (loading) {
    return (
      <div className="movie-list-container">
        <div className="movie-list-loading">
          <LoadingSpinner message="Loading movies..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-list-container">
        <div className="movie-list-error">
          <h3>Error Loading Movies</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="movie-list-container">
        <div className="movie-list-empty">
          <h3>{title}</h3>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-list-container">
      {title && <h2 className="movie-list-title">{title}</h2>}
      
      <div className="movie-grid">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;