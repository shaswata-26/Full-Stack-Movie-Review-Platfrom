import {
  GET_MOVIES,
  GET_MOVIE,
  ADD_MOVIE,
  UPDATE_MOVIE,
  DELETE_MOVIE,
  MOVIE_ERROR,
  CLEAR_MOVIES,
  CLEAR_CURRENT_MOVIE
} from './types';
import { moviesAPI } from '../../services/api';

// Get all movies
export const getMovies = (params = {}) => async (dispatch) => {
  try {
    const res = await moviesAPI.getMovies(params);
    
    dispatch({
      type: GET_MOVIES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MOVIE_ERROR,
      payload: err.response?.data?.message || 'Error fetching movies'
    });
  }
};

// Get single movie
export const getMovie = (id) => async (dispatch) => {
  try {
    const res = await moviesAPI.getMovie(id);
    
    dispatch({
      type: GET_MOVIE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MOVIE_ERROR,
      payload: err.response?.data?.message || 'Error fetching movie'
    });
  }
};

// Add movie (Admin only)
export const addMovie = (movieData) => async (dispatch) => {
  try {
    const res = await moviesAPI.createMovie(movieData);
    
    dispatch({
      type: ADD_MOVIE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MOVIE_ERROR,
      payload: err.response?.data?.message || 'Error adding movie'
    });
    throw err;
  }
};

// Update movie (Admin only)
export const updateMovie = (id, movieData) => async (dispatch) => {
  try {
    const res = await moviesAPI.updateMovie(id, movieData);
    
    dispatch({
      type: UPDATE_MOVIE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MOVIE_ERROR,
      payload: err.response?.data?.message || 'Error updating movie'
    });
    throw err;
  }
};

// Delete movie (Admin only)
export const deleteMovie = (id) => async (dispatch) => {
  try {
    await moviesAPI.deleteMovie(id);
    
    dispatch({
      type: DELETE_MOVIE,
      payload: id
    });
  } catch (err) {
    dispatch({
      type: MOVIE_ERROR,
      payload: err.response?.data?.message || 'Error deleting movie'
    });
    throw err;
  }
};

// Clear movies
export const clearMovies = () => (dispatch) => {
  dispatch({ type: CLEAR_MOVIES });
};

// Clear current movie
export const clearCurrentMovie = () => (dispatch) => {
  dispatch({ type: CLEAR_CURRENT_MOVIE });
};