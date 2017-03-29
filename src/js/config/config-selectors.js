//@flow
import * as c from "./config-constants";

export const getReadOnlyState = (state: any): boolean =>
  state[c.NAME].get("readOnly");
