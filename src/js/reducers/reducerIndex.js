import { combineReducers } from 'redux'
// import { counterReducer } from './counterReducer'
import { appReducer } from './appReducer'
import { fsReducer } from './fs-reducer'
import { configReducer } from './configReducer'
import { navbarReducer } from './navbarReducer'
import { viewContainerReducer } from './view-container-reducer'
import { List, Map } from 'immutable'

export const rootReducer = combineReducers({
  app: appReducer,
  fs: fsReducer,
  config: configReducer,
  navbar: navbarReducer,
  viewContainer: viewContainerReducer
})
