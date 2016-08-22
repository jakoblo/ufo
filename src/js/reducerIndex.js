import { combineReducers } from 'redux'
import { appReducer } from './reducers/appReducer'
import filesystem from './filesystem/fs-index'
import { configReducer } from './reducers/configReducer'
import { navbarReducer } from './reducers/navbarReducer'
import { viewContainerReducer } from './reducers/view-container-reducer'
import { List, Map } from 'immutable'

export const rootReducer = combineReducers({
  app: appReducer,
  [filesystem.constants.NAME]: filesystem.reducer,
  config: configReducer,
  navbar: navbarReducer,
  viewContainer: viewContainerReducer
}) 