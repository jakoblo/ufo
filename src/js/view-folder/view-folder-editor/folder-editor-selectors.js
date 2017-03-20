//@flow

import { createSelector } from "reselect";
import * as Utils from "./slate-extensions/slate-file/slate-file-utils";
import * as c from "./folder-editor-constants";

export const getEditorState = (state: any, path: string) =>
  state[c.NAME].get(path);

/**
 * Factroy for Selector that returns the editorState
 * 
 * @returns {Function} reselect
 */
export const getFilesInEditor_Factory = () => {
  return createSelector([getEditorState], editorState => {
    if (!editorState) {
      return null;
    }
    return Utils.getFilesInState(editorState);
  });
};
