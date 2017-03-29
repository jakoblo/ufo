//@flow
import * as t from "./addon-bar-actiontypes";
import * as c from "./addon-bar-constants";
import * as selectors from "./addon-bar-selectors";
import _ from "lodash";

import type { Action, ThunkArgs } from "../types";

export function toggleView(type: string) {
  return (dispatch: Function, getState: Function) => {
    dispatch({
      type: t.SET_VIEW,
      payload: {
        type: selectors.getCurrentView(getState()) == type ? null : type
      }
    });
  };
}
