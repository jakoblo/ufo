// @flow

import Selection from "../filesystem/selection/sel-index";
import Filter from "../filesystem/filter/filter-index";
import Rename from "../filesystem/rename/rename-index";
import App from "../app/app-index";
import Config from "../config/config-index";
import { remote } from "electron";
import { getStore } from "../app";

export function windowActionHandler(
  action: string,
  event: SyntheticKeyboardEvent
): void {
  if (actionMap[action]) {
    getStore().dispatch(actionMap[action]());
  } else if (event.key.length == 1 && !event.metaKey && !event.ctrlKey) {
    // window.store.dispatch( Selection.actions.selectTypeInputAppend(event.key) )
    getStore().dispatch(Filter.actions.userInputAppend(event.key));
  }
}

type ActionMap = {
  [string]: () => Object | (() => void)
};

const actionMap: ActionMap = {
  navUp: Selection.actions.fileNavUp,
  // selectUp: Selection.actions.fileAddUp,
  pathUp: App.actions.navigateToParentFolder,
  navDown: Selection.actions.fileNavDown,
  // selectDown: Selection.actions.fileAddDown,
  navRight: Selection.actions.dirNext,
  navLeft: Selection.actions.dirPrevious,
  selectAll: Selection.actions.selectAll,
  rename: Rename.actions.renameSelected,
  toggleReadOnly: Config.actions.toggleReadOnly,
  moveToTrash: Selection.actions.toTrash,
  // toggleHiddenFiles: Filter.actions.toggleHiddenFiles,
  // clearFilter: Selection.actions.selectTypeInputClear,
  clearFilter: Filter.actions.userInputClear,
  // deleteFilter: Selection.actions.selectTypeInputBackspace,
  deleteFilter: Filter.actions.userInputBackspace,
  filePreview: () =>
    (dispatch, getState) => {
      let selectedFile = Selection.selectors.getFocusedFile(getState());
      if (selectedFile) {
        remote.getCurrentWindow().previewFile(selectedFile);
      }
    }
};
