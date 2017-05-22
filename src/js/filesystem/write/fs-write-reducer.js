//@flow
import * as t from "./fs-write-actiontypes";
import { OrderedMap, Map, List, Seq, fromJS } from "immutable";
import nodePath from "path";

import type { Action } from "../../types";

const INITIAL_STATE = Map({});

// const INITIAL_STATE = fromJS({
//   "0": {
//     id: 0,
//     clobber: false,
//     type: "COPY",
//     sources: [
//       "/Users/flow/Pictures/vlcsnap-2017-01-25-11h11m35s126.png",
//       "/Users/flow/Pictures/vlcsnap-2017-02-11-00h25m05s252.png",
//       "/Users/flow/Pictures/vlcsnap-2017-02-11-00h31m07s45.png"
//     ],
//     target: "/Users/flow/Pictures/new Folder",
//     subTasks: {},
//     errors: {},
//     finished: true
//   },
//   "1": {
//     id: 1,
//     clobber: false,
//     type: "COPY",
//     sources: [
//       "/Users/flow/Pictures/Screen Shot 2016-11-08 at 23.41.26.png",
//       "/Users/flow/Pictures/Screen Shot 2016-11-09 at 01.09.24 (2).png",
//       "/Users/flow/Pictures/Screen Shot 2016-11-09 at 01.09.24.png",
//       "/Users/flow/Pictures/alien-226245_1280.jpg",
//       "/Users/flow/Pictures/cloud-20046_1920.jpg"
//     ],
//     target: "/Users/flow/Pictures/new Folder",
//     subTasks: {},
//     errors: {},
//     finished: true
//   },
//   "2": {
//     id: 2,
//     clobber: false,
//     type: "COPY",
//     sources: [
//       "/Users/flow/Pictures/vlcsnap-2017-01-25-11h11m35s126.png",
//       "/Users/flow/Pictures/vlcsnap-2017-02-11-00h25m05s252.png",
//       "/Users/flow/Pictures/vlcsnap-2017-02-11-00h31m07s45.png"
//     ],
//     target: "/Users/flow/Pictures/new Folder",
//     subTasks: {
//       "/Users/flow/Pictures/new Folder/vlcsnap-2017-01-25-11h11m35s126.png": {
//         id: 2,
//         source: "/Users/flow/Pictures/vlcsnap-2017-01-25-11h11m35s126.png",
//         destination: "/Users/flow/Pictures/new Folder/vlcsnap-2017-01-25-11h11m35s126.png",
//         type: "COPY",
//         percentage: 1,
//         clobber: false
//       },
//       "/Users/flow/Pictures/new Folder/vlcsnap-2017-02-11-00h25m05s252.png": {
//         id: 2,
//         source: "/Users/flow/Pictures/vlcsnap-2017-02-11-00h25m05s252.png",
//         destination: "/Users/flow/Pictures/new Folder/vlcsnap-2017-02-11-00h25m05s252.png",
//         type: "COPY",
//         percentage: 1,
//         clobber: false
//       },
//       "/Users/flow/Pictures/new Folder/vlcsnap-2017-02-11-00h31m07s45.png": {
//         id: 2,
//         source: "/Users/flow/Pictures/vlcsnap-2017-02-11-00h31m07s45.png",
//         destination: "/Users/flow/Pictures/new Folder/vlcsnap-2017-02-11-00h31m07s45.png",
//         type: "COPY",
//         percentage: 1,
//         clobber: false
//       }
//     },
//     errors: {
//       EEXIST: [
//         {
//           code: "EEXIST",
//           path: "/Users/flow/Pictures/new Folder/vlcsnap-2017-01-25-11h11m35s126.png"
//         }
//       ]
//     },
//     finished: false
//   }
// });

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
