import * as t from './fs-write-actiontypes'
import {OrderedMap, Map, List, Seq, fromJS} from 'immutable'
import nodePath from 'path'

// const INITIAL_STATE = OrderedMap({})
const INITIAL_STATE = OrderedMap({})
// ({
//   0: fromJS({
//     "id":0,
//     "type":"MOVE",
//     "sources":
//       [
//         "/Users/flow/Screen Shot 2016-11-09 at 01.09.24.png",
//         "/Users/flow/Screen Shot 2016-11-09 at 01.09.25.png",
//         "/Users/flow/Screen Shot 2016-11-11 at 18.44.41.png",
//         "/Users/flow/Screen Shot 2016-11-12 at 12.44.12.png"
//       ]
//     ,
//     "targetFolder":"/Users/flow/Desktop",
//     "clobber": false,
//     "finished": false,
//     "files": {},
//     "error": {"code":"ERROR_DEST_ALREADY_EXISTS"}
//   })
// })

export default function reducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case t.FS_WRITE_NEW:
      return state.set(action.payload.id, fromJS({
          id: action.payload.id,
          clobber: action.payload.clobber,
          type: action.payload.type,
          targetFolder: action.payload.targetFolder,
          subTasks: action.payload.subTasks,
          errors: []
        }))

    case t.FS_WRITE_PROGRESS:
      // if(action.payload.file.progress.remaining == 0) {
      //   return state.deleteIn([action.payload.id, 'files', action.payload.file.destination])
      // } else {
      //   return state.setIn(
      //         [action.payload.id, 'files', action.payload.file.destination],
      //         fromJS(action.payload.file))
      // }
    
    case t.FS_WRITE_ERROR:
      return state.updateIn([action.payload.id, 'errors'], arr => arr.push(Map(action.error)))

    case t.FS_WRITE_DONE:
      return state.setIn([action.payload.id, 'finished'], true)
    
    case t.FS_WRITE_REMOVE_ACTION:
      return state.delete(action.payload.id)

    default:
      return state

  }
}