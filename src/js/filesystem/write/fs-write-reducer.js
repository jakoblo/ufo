import * as t from './fs-write-actiontypes'
import {OrderedMap, Map, List, Seq, fromJS} from 'immutable'
import nodePath from 'path'

const INITIAL_STATE = OrderedMap({})

export default function reducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case t.FS_WRITE_NEW:

      return state.set(action.payload.id, fromJS({
          id: action.payload.id,
          task: action.payload.task,
          source: action.payload.source, 
          destination: action.payload.destination,
          clobber: action.payload.clobber,
          finished: false, 
          files: {}
        }))

    case t.FS_WRITE_PROGRESS:
      if(action.payload.file.progress.remaining == 0) {
        return state.deleteIn([action.payload.id, 'files', action.payload.file.destination])
      } else {
        return state.setIn(
              [action.payload.id, 'files', action.payload.file.destination],
              fromJS(action.payload.file))
      }
    
    case t.FS_WRITE_ERROR:
      return state.setIn([action.payload.id, 'error'], Map(action.error))

    case t.FS_WRITE_DONE:
      return state.setIn([action.payload.id, 'finished'], true)
    
    case t.FS_WRITE_REMOVE_ACTION:
      return state.delete(action.payload.id)

    default:
      return state

  }
}