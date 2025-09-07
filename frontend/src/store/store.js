// store/store.js
import { createStore, applyMiddleware, compose } from 'redux';
import {thunk} from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import rootReducer from './reducers';

// Persist config
const persistConfig = {
  key: 'root', // key for localStorage
  storage,
  whitelist: ['someReducer'] // optional: only persist specific reducers
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Initial state
const initialState = {};

// Middleware
const middleware = [thunk];

// Redux DevTools Extension setup
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25
    }) : compose;

// Create enhancer
const enhancer = composeEnhancers(applyMiddleware(...middleware));

// Create store
const store = createStore(
  persistedReducer,
  initialState,
  enhancer
);

// Create persistor
const persistor = persistStore(store);

// Hot reloading for reducers
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers').default;
    store.replaceReducer(persistReducer(persistConfig, nextRootReducer));
  });
}

// Named exports
export { store, persistor };
