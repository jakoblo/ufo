//@flow
import * as t from "./config-actiontypes";
import { Map } from "immutable";

import type { Action } from "../types";

const INITIAL_STATE = Map({
  windowWidth: 800,
  windowHeight: 600,
  readOnly: false,
  indexBase: "index.md"
});

export default function configReducer(
  state: any = INITIAL_STATE,
  action: Action = { type: "", payload: {} }
) {
  switch (action.type) {
    case t.APP_READ_ONLY_TOGGLE:
      return state.set("readOnly", action.payload.readOnly);
    default:
      return state;
  }
}
