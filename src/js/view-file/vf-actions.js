//@flow

import * as t from "./vf-actiontypes";
import type { Action } from "../types";

export function showPreview(filePath: string): Action {
  return {
    type: t.SHOW_PREVIEW,
    payload: {
      path: filePath
    }
  };
}

export function closePreview() {
  return {
    type: t.CLOSE_PREVIEW
  };
}
