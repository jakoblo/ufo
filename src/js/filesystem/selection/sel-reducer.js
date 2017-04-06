//@flow
"use strict";
import * as t from "./sel-actiontypes";
import App from "../../app/app-index";
import Preview from "../../view-file/vf-index";
import Filter from "../filter/filter-index";
import Config from "../../config/config-index";
import FS from "../watch/fs-watch-index";
import FsWrite from "../write/fs-write-index";
import FolderEditor
  from "../../view-folder/view-folder-editor/folder-editor-index";
import * as _ from "lodash";
import nodePath from "path";
import { Map, List, Seq, fromJS } from "immutable";

import type { Action } from "../../types";

const INITIAL_STATE = {
  root: "",
  files: [],
  typeFocus: "",
  typeInput: ""
};

export default function reducer(
  state: any = fromJS(INITIAL_STATE),
  action: Action = { type: "", payload: {} }
) {
  switch (action.type) {
    case t.SET_SELECTION:
      if (action.payload.root != state.get("focusedPath")) {
        // Set Focus to the new directory
        state = state
          .set("typeFocus", action.payload.root)
          .set("typeInput", "");
      }

      // update selection
      return state
        .set("root", action.payload.root)
        .set("files", List(action.payload.files));

    case App.actiontypes.APP_CHANGE_PATH:
      /**
       * The behaviour is little bit confused but thaken from Finder
       * it make sens, but is hard to explain...
       *
       * The Focused Folder where the Typing filter will apply,
       * is different is Click on a folder or if you select it arrow keys.
       * If you select a file, its different again.
       *
       * @TODO try to remove peak
       */

      // Update typing Focus & Input

      const oldTypeFocus = state.get("typeFocus");

      if (action.payload.peak && action.payload.pathRoute.length > 1) {
        if (_.last(action.payload.pathRoute) == state.get("typeFocus")) {
          // Skip Change
          // filtering in the same folder
          // just switching to a file
        } else {
          // Peak in Folders (Key Up/Down Navigation)
          // focus = next to last folder
          state = state.set(
            "typeFocus",
            action.payload.pathRoute[action.payload.pathRoute.length - 2]
          );
          state = state.set("typeInput", "");
        }
      } else {
        // Click on Folder or similar
        // type typeFocus is in this (last) folder
        state = state.set(
          "typeFocus",
          action.payload.pathRoute[action.payload.pathRoute.length - 1]
        );
      }

      if (oldTypeFocus != state.get("typeFocus")) {
        // Focused Folder has chanded
        // lets clear type input
        state = state.set("typeInput", "");
      }

      // Update selection

      if (action.payload.pathRoute.length > 1) {
        // Select the last Folder in the pathrout
        state = state
          // Last Folder name
          .set(
            "files",
            List([nodePath.basename(_.last(action.payload.pathRoute))])
          )
          // next to last Folder
          .set(
            "root",
            action.payload.pathRoute[action.payload.pathRoute.length - 2]
          );
      } else {
        // Only one folder is viewed.. just the root, no selection
        state = state
          .set("root", _.last(action.payload.pathRoute))
          .set("files", List([]));
      }

      return state;

    case Preview.actiontypes.SHOW_PREVIEW:
      // Select File wich is opend in File Preview
      return state
        .set("root", nodePath.dirname(action.payload.path))
        .set("files", List([nodePath.basename(action.payload.path)]));

    case FS.actiontypes.FILE_UNLINK:
      // a selected file has maybe been delete
      // If that is the case, it's necessary to remove that
      // or the easy way, reset the selection....
      if (
        state.get("root") &&
        state.get("root").indexOf(nodePath.dirname(action.payload.path)) > -1
      ) {
        return state.set("files", List([]));
      }
      return state;

    case FolderEditor.actiontypes.FOLDER_EDITOR_CHANGE:
      return state
        .set("root", action.payload.path)
        .set("files", List(action.payload.selectedFiles));

    case t.SELECT_TYPE_SET:
      return state.set("typeInput", action.payload.input);

    case t.SELECT_TYPE_CLEAR:
      return state.set("typeInput", "");

    case Config.actiontypes.APP_READ_ONLY_TOGGLE:
      return state.set("typeInput", "");

    case FsWrite.actiontypes.FS_WRITE_NEW:
      return state.set("files", List([]));

    default:
      return state;
  }
}
