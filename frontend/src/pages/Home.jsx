import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMovies } from '../store/actions/movieActions';
import MovieList from '../components/movie/MovieList';
import LoadingSpinner from '../components/common/LoadingSpinner/LoadingSpinner';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { movies: featuredMovies, loading: moviesLoading } = useSelector(state => state.movies);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Get top rated movies for the featured section
    dispatch(getMovies({ limit: 8, sortBy: 'averageRating', sortOrder: 'desc', minRating: 4 }));
  }, [dispatch]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover & Review
            <span className="highlight"> Amazing Movies</span>
          </h1>
          <p className="hero-subtitle">
            Join our community of movie enthusiasts. Share your thoughts, 
            discover new films, and build your personal watchlist.
          </p>
          <div className="hero-actions">
            <Link to="/movies" className="btn btn-primary btn-large">
              Explore Movies
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-secondary btn-large">
                Join Now
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="movie-poster-grid">
            <div className="poster poster-1">🎬</div>
            <div className="poster poster-2">🍿</div>
            <div className="poster poster-3">🌟</div>
            <div className="poster poster-4">📽️</div>
          </div>
        </div>
      </section>

      {/* Featured Movies Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Top Rated Movies</h2>
          <Link to="/movies" className="view-all-link">
            View All Movies →
          </Link>
        </div>
        
        {moviesLoading ? (
          <div className="section-loading">
            <LoadingSpinner message="Loading featured movies..." />
          </div>
        ) : (
          <MovieList
            movies={featuredMovies.slice(0, 4)}
            loading={moviesLoading}
            title={null}
          />
        )}
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Getting started with our movie community is easy</p>
        </div>
        
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">1</div>
            <h3>Browse Movies</h3>
            <p>Explore our extensive collection of movies from various genres and eras.</p>
          </div>
          
          <div className="step-card">
            <div className="step-icon">2</div>
            <h3>Rate & Review</h3>
            <p>Share your honest opinions by rating movies and writing detailed reviews.</p>
          </div>
          
          <div className="step-card">
            <div className="step-icon">3</div>
            <h3>Build Watchlist</h3>
            <p>Save movies you want to watch later and keep track of your favorites.</p>
          </div>
          
          <div className="step-card">
            <div className="step-icon">4</div>
            <h3>Join Community</h3>
            <p>Connect with other movie lovers and discover new recommendations.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Movies</p>
          </div>
          <div className="stat-item">
            <h3>50,000+</h3>
            <p>Reviews</p>
          </div>
          <div className="stat-item">
            <h3>5,000+</h3>
            <p>Users</p>
          </div>
          <div className="stat-item">
            <h3>100+</h3>
            <p>Genres</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Join Our Movie Community?</h2>
            <p>Sign up today and start sharing your movie experiences with others.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Create Account
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;