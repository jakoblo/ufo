import { combineReducers } from 'redux'
import undoable from 'redux-undo'
import Filesystem from './filesystem/watch/fs-watch-index'
import Selection from './filesystem/selection/sel-index'
import FsWrite from './filesystem/write/fs-write-index' 
import Config from './config/config-index'
import ViewFile from './view-file/vf-index'
import Navbar from './navbar/navbar-index'
import History from './history/history-index' 

export const rootReducer = combineReducers({
  [ViewFile.constants.NAME]: ViewFile.reducer,
  [Selection.constants.NAME]: Selection.reducer,
  [Filesystem.constants.NAME]: Filesystem.reducer,
  [Config.constants.NAME]: Config.reducer,
  [Navbar.constants.NAME]: Navbar.reducer,
  [History.constants.NAME]: History.reducer,
  [FsWrite.constants.NAME]: FsWrite.reducer
}) 

