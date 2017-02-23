import { createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {rootReducer} from './reducerIndex'
import createLogger from 'redux-logger';
// import promiseMiddleware from '../middleware/promise-middleware'



export function storeSetup(initialState) {


const store = createStore(
  rootReducer,
  initialState,
  compose(
    getMiddleware(),
    (window.devToolsExtension && process.env.NODE_ENV == "development") ? window.devToolsExtension() : f => f
  )
)
  return store;
}

function getMiddleware() {

  const logger = createLogger();

  let middleware = [
    // promiseMiddleware,
    thunk,
    // logger
  ];

  if (process.env.NODE_ENV !== 'production') {
    middleware = [...middleware];
  }

  return applyMiddleware(...middleware);
}
