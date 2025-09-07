import { combineReducers } from 'redux';
import auth from './authReducer';
import movies from './movieReducer';
import reviews from './reviewReducer';
import users from './userReducer';

export default combineReducers({
  auth,
  movies,
  reviews,
  users
});