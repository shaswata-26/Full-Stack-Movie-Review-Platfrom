import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  USER_LOADED,
  AUTH_ERROR,
  CLEAR_ERRORS
} from './types';
import { authAPI } from '../../services/api';

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      dispatch({ type: AUTH_ERROR });
      return;
    }

    const res = await authAPI.getMe();
    
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response?.data?.message || 'Authentication failed'
    });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  try {
    dispatch(clearErrors());
    
    const res = await authAPI.register(formData);
    
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response?.data?.message || 'Registration failed'
    });
  }
};

// Login User
export const login = (formData) => async (dispatch) => {
  try {
    dispatch(clearErrors());
    
    const res = await authAPI.login(formData);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.message || 'Login failed'
    });
  }
};

// Logout User
export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: LOGOUT });
};

// Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};