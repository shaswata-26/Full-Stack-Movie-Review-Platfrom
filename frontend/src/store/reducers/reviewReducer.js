import {
  GET_REVIEWS,
  GET_REVIEW,
  ADD_REVIEW,
  UPDATE_REVIEW,
  DELETE_REVIEW,
  REVIEW_ERROR,
  CLEAR_REVIEWS,
  CLEAR_CURRENT_REVIEW
} from '../actions/types';

const initialState = {
  reviews: [],
  currentReview: null,
  loading: true,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalReviews: 0,
  movieId: null,
  userId: null
};

const reviewReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_REVIEWS:
      return {
        ...state,
        reviews: payload.reviews,
        currentPage: payload.currentPage,
        totalPages: payload.totalPages,
        totalReviews: payload.totalReviews,
        movieId: payload.movieId || null,
        userId: payload.userId || null,
        loading: false,
        error: null
      };

    case GET_REVIEW:
      return {
        ...state,
        currentReview: payload,
        loading: false,
        error: null
      };

    case ADD_REVIEW:
      return {
        ...state,
        reviews: [payload, ...state.reviews],
        totalReviews: state.totalReviews + 1,
        loading: false,
        error: null
      };

    case UPDATE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review._id === payload._id ? payload : review
        ),
        currentReview: state.currentReview?._id === payload._id ? payload : state.currentReview,
        loading: false,
        error: null
      };

    case DELETE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.filter(review => review._id !== payload),
        totalReviews: state.totalReviews - 1,
        loading: false,
        error: null
      };

    case REVIEW_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };

    case CLEAR_REVIEWS:
      return {
        ...state,
        reviews: [],
        currentPage: 1,
        totalPages: 1,
        totalReviews: 0,
        movieId: null,
        userId: null,
        loading: false
      };

    case CLEAR_CURRENT_REVIEW:
      return {
        ...state,
        currentReview: null,
        loading: false
      };

    default:
      return state;
  }
};

export default reviewReducer;