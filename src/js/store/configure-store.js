import { createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
// import logger from './logger'
import {rootReducer} from '../reducers/reducerIndex'
import {calulateCounter} from '../actions/counterActions'

// import promiseMiddleware from '../middleware/promise-middleware'

export function configureStore(initialState) {

  // http://redux.js.org/docs/api/compose.html kapier ich nicht
  const store = compose(_getMiddleware())(createStore)(rootReducer, initialState, window.devToolsExtension ? window.devToolsExtension() : f => f);
  return store;
}

function _getMiddleware() {
  let middleware = [
    // promiseMiddleware,
    thunk
  ];

  if (process.env.NODE_ENV !== 'production') {
    middleware = [...middleware];
  }

  return applyMiddleware(...middleware);
}
