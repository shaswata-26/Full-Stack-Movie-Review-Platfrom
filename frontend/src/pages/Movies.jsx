import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMovies } from '../store/actions/movieActions';
import MovieList from '../components/movie/MovieList';
import MovieFilters from '../components/movie/MovieFilters';
import SearchBar from '../components/common/SearchBar/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner/LoadingSpinner';
import './Movies.css';
import Pagination from '../components/common/Pagination/Pagination';

const Movies = () => {
  const dispatch = useDispatch();
  const { movies, loading, error, currentPage, totalPages, totalMovies } = useSelector(state => state.movies);
  
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    minRating: '',
    sortBy: 'title',
    sortOrder: 'asc',
    search: ''
  });

  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    // Fetch movies with initial filters
    dispatch(getMovies({ page: 1, limit: 12, ...filters }));
  }, [dispatch, filters]);

  useEffect(() => {
    // Extract unique genres and years from movies
    const uniqueGenres = [...new Set(movies.flatMap(movie => movie.genre))].sort();
    const uniqueYears = [...new Set(movies.map(movie => movie.releaseYear))].sort((a, b) => b - a);
    
    setGenres(uniqueGenres);
    setYears(uniqueYears);
  }, [movies]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handlePageChange = (page) => {
    dispatch(getMovies({ page, limit: 12, ...filters }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1>Browse Movies</h1>
        <p>Discover amazing movies from various genres and eras</p>
      </div>

      <div className="movies-content">
        {/* Search and Filters */}
        <div className="movies-sidebar">
          <div className="search-section">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search movies by title or director..."
            />
          </div>
          
          <MovieFilters
            onFilterChange={handleFilterChange}
            genres={genres}
            years={years}
            loading={loading}
          />
        </div>

        {/* Movies List */}
        <div className="movies-main">
          <div className="results-header">
            <h2>
              {totalMovies > 0 ? `${totalMovies} Movies Found` : 'No Movies Found'}
            </h2>
            {totalMovies > 0 && (
              <span className="results-count">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          {loading ? (
            <div className="loading-container">
              <LoadingSpinner message="Loading movies..." />
            </div>
          ) : error ? (
            <div className="error-container">
              <h3>Error Loading Movies</h3>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <MovieList
                movies={movies}
                loading={loading}
                error={error}
                title={null}
                emptyMessage="No movies match your search criteria. Try adjusting your filters."
              />
              
              {totalPages > 1 && (
                <div className="pagination-container">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;