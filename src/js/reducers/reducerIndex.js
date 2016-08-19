import { combineReducers } from 'redux'
// import { counterReducer } from './counterReducer'
import { appReducer } from './appReducer'
import { configReducer } from './configReducer'
import { navbarReducer } from './navbarReducer'

export const rootReducer = combineReducers({app: appReducer, config: configReducer, navbar: navbarReducer});
