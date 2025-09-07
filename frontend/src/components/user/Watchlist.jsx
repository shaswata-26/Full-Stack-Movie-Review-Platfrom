import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getWatchlist } from '../../store/actions/userActions';
import MovieList from '../movie/MovieList';
import LoadingSpinner from '../common/LoadingSpinner/LoadingSpinner';
import './Watchlist.css';

const Watchlist = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector(state => state.auth);
  const { watchlist, loading, error, currentPage, totalPages, totalItems } = useSelector(state => state.users);

  const isOwnWatchlist = currentUser && currentUser._id === id;

  useEffect(() => {
    if (id) {
      dispatch(getWatchlist(id, { page: 1, limit: 12 }));
    }
  }, [dispatch, id]);

  const handlePageChange = (page) => {
    dispatch(getWatchlist(id, { page, limit: 12 }));
  };

  if (loading) {
    return (
      <div className="watchlist-container">
        <div className="watchlist-loading">
          <LoadingSpinner message="Loading watchlist..." />
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h1>
          {isOwnWatchlist ? 'My Watchlist' : 'Watchlist'}
        </h1>
        {totalItems > 0 && (
          <p className="watchlist-count">
            {totalItems} movie{totalItems !== 1 ? 's' : ''} in watchlist
          </p>
        )}
      </div>

      {error && (
        <div className="watchlist-error">
          <h3>Error Loading Watchlist</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && watchlist.length === 0 && (
        <div className="watchlist-empty">
          <div className="empty-icon">🎬</div>
          <h2>Your watchlist is empty</h2>
          <p>
            {isOwnWatchlist 
              ? 'Start adding movies to your watchlist to keep track of what you want to watch!'
              : 'This user has not added any movies to their watchlist yet.'
            }
          </p>
          {isOwnWatchlist && (
            <a href="/movies" className="btn btn-primary">
              Browse Movies
            </a>
          )}
        </div>
      )}

      {watchlist.length > 0 && (
        <>
          <MovieList
            movies={watchlist}
            loading={loading}
            error={error}
            title={null}
            emptyMessage="No movies in watchlist"
          />
          
          {totalPages > 1 && (
            <div className="watchlist-pagination">
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
  );
};

export default Watchlist;