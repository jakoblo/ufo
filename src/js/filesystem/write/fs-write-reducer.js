//@flow
import * as t from "./fs-write-actiontypes";
import { OrderedMap, Map, List, Seq, fromJS } from "immutable";
import nodePath from "path";

import type { Action } from "../../types";

const INITIAL_STATE = Map({});

export default function reducer(
  state: any = INITIAL_STATE,
  action: Action = { type: "", payload: {} }
) {
  switch (action.type) {
    case t.FS_WRITE_NEW:
      return state.set(
        action.payload.id,
        fromJS({
          id: action.payload.id,
          clobber: action.payload.clobber,
          type: action.payload.type,
          sources: action.payload.sources,
          target: action.payload.target,
          subTasks: action.payload.subTasks,
          errors: {},
          finished: false
        })
      );

    case t.FS_WRITE_PROGRESS:
      return state.setIn(
        [action.payload.id, "subTasks"],
        fromJS(action.payload.subTasks)
      );

    case t.FS_WRITE_ERROR:
      let errorCode = "ERROR";
      if (action.error && action.error.code) {
        errorCode = action.error.code;
      }
      return state.setIn(
        [action.payload.id, "errors", errorCode],
        (state.getIn([action.payload.id, "errors", errorCode]) || List([]))
          .push(Map(action.error))
      );

    case t.FS_WRITE_SUBTASK_DONE:
      return state.deleteIn([
        action.payload.id,
        "subTasks",
        action.payload.subTaskDestination
      ]);

    case t.FS_WRITE_DONE:
      return state.setIn([action.payload.id, "finished"], true);
    //.deleteIn([action.payload.id, 'subTasks'])
    case t.FS_WRITE_REMOVE_ACTION:
      console.log(action.payload.id);
      console.log(state.toJS());
      return state.delete(action.payload.id);

    default:
      return state;
  }
}
