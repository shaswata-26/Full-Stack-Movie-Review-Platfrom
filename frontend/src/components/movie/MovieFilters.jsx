import React, { useState } from 'react';
import './MovieFilters.css';

const MovieFilters = ({ onFilterChange, genres = [], years = [], loading = false }) => {
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    minRating: '',
    sortBy: 'title',
    sortOrder: 'asc'
  });

  const currentYear = new Date().getFullYear();
  const yearOptions = years.length > 0 ? years : Array.from(
    { length: currentYear - 1980 + 1 },
    (_, i) => currentYear - i
  );

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      genre: '',
      year: '',
      minRating: '',
      sortBy: 'title',
      sortOrder: 'asc'
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="movie-filters">
      <h3 className="filters-title">Filter Movies</h3>
      
      <div className="filters-grid">
        {/* Genre Filter */}
        <div className="filter-group">
          <label htmlFor="genre" className="filter-label">Genre</label>
          <select
            id="genre"
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="filter-select"
            disabled={loading}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="filter-group">
          <label htmlFor="year" className="filter-label">Release Year</label>
          <select
            id="year"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="filter-select"
            disabled={loading}
          >
            <option value="">All Years</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="filter-group">
          <label htmlFor="minRating" className="filter-label">Minimum Rating</label>
          <select
            id="minRating"
            value={filters.minRating}
            onChange={(e) => handleFilterChange('minRating', e.target.value)}
            className="filter-select"
            disabled={loading}
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Star</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label htmlFor="sortBy" className="filter-label">Sort By</label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
            disabled={loading}
          >
            <option value="title">Title</option>
            <option value="releaseYear">Release Year</option>
            <option value="averageRating">Rating</option>
            <option value="reviewCount">Review Count</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-group">
          <label htmlFor="sortOrder" className="filter-label">Order</label>
          <select
            id="sortOrder"
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="filter-select"
            disabled={loading}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="filter-group">
          <label className="filter-label invisible">Reset</label>
          <button
            onClick={handleReset}
            className="filter-reset-btn"
            disabled={loading}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieFilters;