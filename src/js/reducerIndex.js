//@flow
import { combineReducers } from "redux";
import App from "./app/app-index";
import fsWatch from "./filesystem/watch/fs-watch-index";
import fsWrite from "./filesystem/write/fs-write-index";
import fsRename from "./filesystem/rename/rename-index";
import Selection from "./filesystem/selection/sel-index";
import Filter from "./filesystem/filter/filter-index";
import Config from "./config/config-index";
import ViewFile from "./view-file/vf-index";
import Navbar from "./navbar/navbar-index";
import AddonBar from "./addon-bar/addon-bar-index";
import FolderEditor from "./view-folder/view-folder-editor/folder-editor-index";

export const rootReducer = combineReducers({
  [FolderEditor.constants.NAME]: FolderEditor.reducer,
  [ViewFile.constants.NAME]: ViewFile.reducer,
  [Selection.constants.NAME]: Selection.reducer,
  [fsWatch.constants.NAME]: fsWatch.reducer,
  [fsWrite.constants.NAME]: fsWrite.reducer,
  [fsRename.constants.NAME]: fsRename.reducer,
  [Filter.constants.NAME]: Filter.reducer,
  [Config.constants.NAME]: Config.reducer,
  [Navbar.constants.NAME]: Navbar.reducer,
  [App.constants.NAME]: App.reducer,
  [AddonBar.constants.NAME]: AddonBar.reducer
});
