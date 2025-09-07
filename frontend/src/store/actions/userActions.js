import {
  GET_USER,
  UPDATE_USER,
  GET_WATCHLIST,
  ADD_TO_WATCHLIST,
  REMOVE_FROM_WATCHLIST,
  USER_ERROR,
  CLEAR_USER
} from './types';
import { usersAPI } from '../../services/api';

// Get user profile
export const getUserProfile = (userId) => async (dispatch) => {
  try {
    const res = await usersAPI.getUser(userId);
    
    dispatch({
      type: GET_USER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.response?.data?.message || 'Error fetching user profile'
    });
  }
};

// Update user profile
export const updateUserProfile = (userId, userData) => async (dispatch) => {
  try {
    const res = await usersAPI.updateUser(userId, userData);
    
    dispatch({
      type: UPDATE_USER,
      payload: res.data
    });
    
    return res.data;
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.response?.data?.message || 'Error updating profile'
    });
    throw err;
  }
};

// Get user watchlist
export const getWatchlist = (userId, params = {}) => async (dispatch) => {
  try {
    const res = await usersAPI.getWatchlist(userId, params);
    
    dispatch({
      type: GET_WATCHLIST,
      payload: {
        watchlist: res.data.watchlist,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalItems: res.data.totalItems,
        userId
      }
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.response?.data?.message || 'Error fetching watchlist'
    });
  }
};

// Add to watchlist
export const addToWatchlist = (userId, movieId) => async (dispatch) => {
  try {
    const res = await usersAPI.addToWatchlist(userId, movieId);
    
    dispatch({
      type: ADD_TO_WATCHLIST,
      payload: res.data
    });
    
    return res.data;
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.response?.data?.message || 'Error adding to watchlist'
    });
    throw err;
  }
};

// Remove from watchlist
export const removeFromWatchlist = (userId, movieId) => async (dispatch) => {
  try {
    await usersAPI.removeFromWatchlist(userId, movieId);
    
    dispatch({
      type: REMOVE_FROM_WATCHLIST,
      payload: movieId
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.response?.data?.message || 'Error removing from watchlist'
    });
    throw err;
  }
};

// Clear user data
export const clearUser = () => (dispatch) => {
  dispatch({ type: CLEAR_USER });
};