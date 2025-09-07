import {
  GET_MOVIES,
  GET_MOVIE,
  ADD_MOVIE,
  UPDATE_MOVIE,
  DELETE_MOVIE,
  MOVIE_ERROR,
  CLEAR_MOVIES,
  CLEAR_CURRENT_MOVIE
} from '../actions/types';

const initialState = {
  movies: [],
  currentMovie: null,
  loading: true,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalMovies: 0,
  filters: {}
};

const movieReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MOVIES:
      return {
        ...state,
        movies: payload.movies,
        currentPage: payload.currentPage,
        totalPages: payload.totalPages,
        totalMovies: payload.totalMovies,
        loading: false,
        error: null
      };

    case GET_MOVIE:
      return {
        ...state,
        currentMovie: payload,
        loading: false,
        error: null
      };

    case ADD_MOVIE:
      return {
        ...state,
        movies: [payload, ...state.movies],
        totalMovies: state.totalMovies + 1,
        loading: false,
        error: null
      };

    case UPDATE_MOVIE:
      return {
        ...state,
        movies: state.movies.map(movie =>
          movie._id === payload._id ? payload : movie
        ),
        currentMovie: state.currentMovie?._id === payload._id ? payload : state.currentMovie,
        loading: false,
        error: null
      };

    case DELETE_MOVIE:
      return {
        ...state,
        movies: state.movies.filter(movie => movie._id !== payload),
        totalMovies: state.totalMovies - 1,
        loading: false,
        error: null
      };

    case MOVIE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };

    case CLEAR_MOVIES:
      return {
        ...state,
        movies: [],
        currentPage: 1,
        totalPages: 1,
        totalMovies: 0,
        loading: false
      };

    case CLEAR_CURRENT_MOVIE:
      return {
        ...state,
        currentMovie: null,
        loading: false
      };

    default:
      return state;
  }
};

export default movieReducer;