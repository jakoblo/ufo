//@flow
import App from "../app/app-index";
import FS from "../filesystem/watch/fs-watch-index";
import { Map } from "immutable";
import * as t from "./vf-actiontypes";

import type { Action } from "../types";

const INITIAL_STATE = Map({
  path: null
});

export default function previewReducer(
  state: any = INITIAL_STATE,
  action: Action = { type: "", payload: {} }
) {
  switch (action.type) {
    case t.SHOW_PREVIEW:
      return state.set("path", action.payload.path);

    case t.CLOSE_PREVIEW:
      return state.set("path", null);

    case App.actiontypes.APP_CHANGE_PATH:
      return state.set("path", null);

    case FS.actiontypes.FILE_UNLINK:
      // The File or Parent File of the FileView has maybe been delete
      // If that is the case, it's necessary to close the preview
      if (
        state.get("path") && state.get("path").indexOf(action.payload.path) > -1
      ) {
        return state.set("path", null);
      }
      return state;

    default:
      return state;
  }
}
