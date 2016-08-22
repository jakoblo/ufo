import { combineReducers } from 'redux'
import { appReducer } from './reducers/appReducer'
import filesystem from './filesystem/fs-index'
import { configReducer } from './reducers/configReducer'
import Navbar from './navbar/navbar-index'
import { viewContainerReducer } from './reducers/view-container-reducer'
import { List, Map } from 'immutable'

export const rootReducer = combineReducers({
  app: appReducer,
  [filesystem.constants.NAME]: filesystem.reducer,
  config: configReducer,
  navbar: Navbar.reducer,
  viewContainer: viewContainerReducer
}) 