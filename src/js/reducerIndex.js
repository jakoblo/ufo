import { combineReducers } from 'redux'
import undoable from 'redux-undo'
import Filesystem from './filesystem/fs-index'
import Selection from './selection/sel-index'
import Config from './config/config-index'
import ViewFile from './view-file/vf-index'
import Navbar from './navbar/navbar-index'
import History from './history/history-index'

export const rootReducer = combineReducers({
  [Filesystem.constants.NAME]: Filesystem.reducer,
  [Selection.constants.NAME]: Selection.reducer,
  [ViewFile.constants.NAME]: ViewFile.reducer,
  [Config.constants.NAME]: undoable(Config.reducer),
  [Navbar.constants.NAME]: undoable(Navbar.reducer),
  [History.constants.NAME]: History.reducer
}) 
