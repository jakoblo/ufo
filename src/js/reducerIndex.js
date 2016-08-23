import { combineReducers } from 'redux'
import undoable from 'redux-undo'
import App from './app/app-index'
import Filemanager from './filemanager/fm-index'
import Config from './config/config-index'
import ViewContainer from './viewcontainer/vc-index'
import Navbar from './navbar/navbar-index'

export const rootReducer = combineReducers({
  [App.constants.NAME]: App.reducer,
  [Filemanager.constants.NAME]: Filemanager.reducer,
  [Config.constants.NAME]: undoable(Config.reducer),
  [Navbar.constants.NAME]: undoable(Navbar.reducer),
  [ViewContainer.constants.NAME]: ViewContainer.reducer
}) 
