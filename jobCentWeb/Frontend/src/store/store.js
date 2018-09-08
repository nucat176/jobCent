import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/root_reducer';
// import logger from 'redux-logger';
import thunk from 'redux-thunk';

const middlewares = [thunk];

if (process.env.NODE_ENV !== 'production') {
    // must use 'require' (import only allowed at top of file)
    const { logger } = require('redux-logger');
    middlewares.push(logger);
}

export default (preloadedState = {}) => (
    createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(thunk, ...middlewares)
    )
);