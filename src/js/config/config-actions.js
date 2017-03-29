//@flow
import * as t from "./config-actiontypes";
import App from "../app/app-index";
import Navbar from "../navbar/navbar-index";
import * as Utils from "../utils/utils-index";
import * as selectors from "./config-selectors";
import { List, Map } from "immutable";
import os from "os";
import _ from "lodash";

import type { ThunkArgs, Action } from "../types";

export function toggleReadOnly() {
  return (dispatch: Function, getState: Function) => {
    dispatch({
      type: t.APP_READ_ONLY_TOGGLE,
      payload: {
        readOnly: !selectors.getReadOnlyState(getState())
      }
    });
  };
}
