import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../store/actions/authActions';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>🎬 Movie Reviews</h1>
        </Link>
        
        <nav className="header-nav">
          <Link to="/movies" className="nav-link">Movies</Link>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/profile" className="nav-link">
                👤 {user?.username}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/register" className="nav-link">Register</Link>
              <Link to="/login" className="nav-link">Login</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;