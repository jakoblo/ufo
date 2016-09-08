import { combineReducers } from 'redux'
import undoable from 'redux-undo'
import App from './app/app-index'
import Filesystem from './filesystem/fs-index'
import Selection from './selection/sel-index'
import Config from './config/config-index'
import ViewContainer from './viewcontainer/vc-index'
import Navbar from './navbar/navbar-index'

export const rootReducer = combineReducers({
  [App.constants.NAME]: App.reducer,
  [Filesystem.constants.NAME]: Filesystem.reducer,
  [Selection.constants.NAME]: Selection.reducer,
  [Config.constants.NAME]: undoable(Config.reducer),
  [Navbar.constants.NAME]: undoable(Navbar.reducer)
}) 
