import {
  GET_USER,
  UPDATE_USER,
  GET_WATCHLIST,
  ADD_TO_WATCHLIST,
  REMOVE_FROM_WATCHLIST,
  USER_ERROR,
  CLEAR_USER
} from '../actions/types';

const initialState = {
  user: null,
  watchlist: [],
  loading: true,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_USER:
      return {
        ...state,
        user: payload,
        loading: false,
        error: null
      };

    case UPDATE_USER:
      return {
        ...state,
        user: payload,
        loading: false,
        error: null
      };

    case GET_WATCHLIST:
      return {
        ...state,
        watchlist: payload.watchlist,
        currentPage: payload.currentPage,
        totalPages: payload.totalPages,
        totalItems: payload.totalItems,
        loading: false,
        error: null
      };

    case ADD_TO_WATCHLIST:
      return {
        ...state,
        watchlist: [payload, ...state.watchlist],
        totalItems: state.totalItems + 1,
        loading: false,
        error: null
      };

    case REMOVE_FROM_WATCHLIST:
      return {
        ...state,
        watchlist: state.watchlist.filter(movie => movie._id !== payload),
        totalItems: state.totalItems - 1,
        loading: false,
        error: null
      };

    case USER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };

    case CLEAR_USER:
      return {
        ...state,
        user: null,
        watchlist: [],
        loading: false,
        error: null
      };

    default:
      return state;
  }
};

export default userReducer;