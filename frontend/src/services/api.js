import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      console.error('Access forbidden: Insufficient permissions');
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout: Please check your connection');
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Movies API
export const moviesAPI = {
  getMovies: (params = {}) => api.get('/movies', { params }),
  getMovie: (id) => api.get(`/movies/${id}`),
  createMovie: (movieData) => api.post('/movies', movieData),
  updateMovie: (id, movieData) => api.put(`/movies/${id}`, movieData),
  deleteMovie: (id) => api.delete(`/movies/${id}`),
  getMovieReviews: (id, params = {}) => api.get(`/movies/${id}/reviews`, { params }),
};

// Reviews API
export const reviewsAPI = {
  createReview: (movieId, reviewData) => api.post(`/reviews/${movieId}`, reviewData),
  updateReview: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  getReview: (reviewId) => api.get(`/reviews/${reviewId}`),
};

// Users API
export const usersAPI = {
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  getUserReviews: (id, params = {}) => api.get(`/users/${id}/reviews`, { params }),
  getWatchlist: (id, params = {}) => api.get(`/users/${id}/watchlist`, { params }),
  addToWatchlist: (id, movieId) => api.post(`/users/${id}/watchlist`, { movieId }),
  removeFromWatchlist: (id, movieId) => api.delete(`/users/${id}/watchlist/${movieId}`),
};

// File Upload API (if needed)
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Utility functions for API calls
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || `Server error: ${error.response.status}`,
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      message: 'Network error: Please check your connection',
      status: null,
      data: null
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: null,
      data: null
    };
  }
};

// Retry mechanism for failed requests
export const retryApiCall = async (apiCall, retries = 3, delay = 1000) => {
  try {
    return await apiCall();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryApiCall(apiCall, retries - 1, delay * 2);
    }
    throw error;
  }
};

export default api;