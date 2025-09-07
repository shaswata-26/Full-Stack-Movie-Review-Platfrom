import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../../store/actions/userActions';
import { getUserReviews } from '../../store/actions/reviewActions';
import ReviewList from '../review/ReviewList';
import LoadingSpinner from '../common/LoadingSpinner/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector(state => state.auth);
  const { user: profileUser, loading: profileLoading } = useSelector(state => state.users);
  const { reviews, loading: reviewsLoading, currentPage, totalPages, totalReviews } = useSelector(state => state.reviews);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    avatar: ''
  });
  const [errors, setErrors] = useState({});

  const isOwnProfile = currentUser && currentUser._id === id;

  useEffect(() => {
    if (id) {
      dispatch(getUserProfile(id));
      dispatch(getUserReviews(id, { page: 1, limit: 5 }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (profileUser) {
      setEditData({
        username: profileUser.username || '',
        email: profileUser.email || '',
        avatar: profileUser.avatar || ''
      });
    }
  }, [profileUser]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setErrors({});
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (editData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!editData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(updateUserProfile(id, editData));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      username: profileUser.username || '',
      email: profileUser.email || '',
      avatar: profileUser.avatar || ''
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleReviewsPageChange = (page) => {
    dispatch(getUserReviews(id, { page, limit: 5 }));
  };

  if (profileLoading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <LoadingSpinner message="Loading profile..." />
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Profile Not Found</h2>
          <p>The user profile you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profileUser.avatar ? (
            <img 
              src={profileUser.avatar} 
              alt={profileUser.username}
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
          ) : (
            <div className="avatar-placeholder">
              {profileUser.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="profile-info">
          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleInputChange}
                  className={errors.username ? 'error' : ''}
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label>Avatar URL</label>
                <input
                  type="url"
                  name="avatar"
                  value={editData.avatar}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="profile-username">{profileUser.username}</h1>
              <p className="profile-email">{profileUser.email}</p>
              <p className="profile-join-date">
                Member since {new Date(profileUser.joinDate).toLocaleDateString()}
              </p>
            </>
          )}

          {isOwnProfile && (
            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="btn btn-primary">
                    Save Changes
                  </button>
                  <button onClick={handleCancel} className="btn btn-secondary">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleEditToggle} className="btn btn-primary">
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Activity</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{totalReviews}</h3>
              <p>Reviews Written</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Movies Watched</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Watchlist Items</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h2>Recent Reviews</h2>
            {totalReviews > 5 && (
              <Link to={`/users/${id}/reviews`} className="view-all-link">
                View All Reviews →
              </Link>
            )}
          </div>
          
          <ReviewList
            reviews={reviews}
            loading={reviewsLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalReviews={totalReviews}
            onPageChange={handleReviewsPageChange}
            currentUserId={currentUser?._id}
          />
        </div>

        {isOwnProfile && (
          <div className="profile-section">
            <h2>Quick Links</h2>
            <div className="quick-links">
              <Link to={`/users/${id}/watchlist`} className="quick-link">
                📋 My Watchlist
              </Link>
              <Link to="/movies" className="quick-link">
                🎬 Browse Movies
              </Link>
              <Link to="/reviews" className="quick-link">
                ✍️ My Reviews
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;