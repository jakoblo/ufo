// @flow

import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "./reducerIndex";
import { createLogger } from "redux-logger";
// import promiseMiddleware from '../middleware/promise-middleware'

export function storeSetup(initialState: any) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      getMiddleware(),
      window.devToolsExtension && process.env.NODE_ENV == "development"
        ? window.devToolsExtension()
        : f => f
    )
  );
  return store;
}

function getMiddleware() {
  const logger = createLogger({
    collapsed: true,
    timestamp: false
  });

  let middleware = [
    // promiseMiddleware,
    thunk
  ];

  if (process.env.NODE_ENV !== "production") {
    middleware = [...middleware, logger];
  }

  return applyMiddleware(...middleware);
}
