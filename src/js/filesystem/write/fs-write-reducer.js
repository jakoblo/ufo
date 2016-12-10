import * as t from './fs-write-actiontypes'
import {OrderedMap, Map, List, Seq, fromJS} from 'immutable'
import nodePath from 'path'

const INITIAL_STATE = OrderedMap({})

export default function reducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case t.FS_WRITE_NEW:
      return state.set(action.payload.id, fromJS({
        id: action.payload.id,
        clobber: action.payload.clobber,
        type: action.payload.type,
        sources: action.payload.sources,
        targetFolder: action.payload.targetFolder,
        subTasks: action.payload.subTasks,
        errors: {},
        finished: false
      }))

    case t.FS_WRITE_PROGRESS:
      return state.setIn([action.payload.id, 'subTasks'], fromJS(action.payload.subTasks))
    
    case t.FS_WRITE_ERROR:
      return state.setIn(
        [action.payload.id, 'errors', action.error.code],
        ( state.getIn([action.payload.id, 'errors', action.error.code]) || List([]) ).push( Map(action.error) )
      )

    case t.FS_WRITE_SUBTASK_DONE:
      return state.deleteIn([action.payload.id, 'subTasks', action.payload.subTaskDestination])

    case t.FS_WRITE_DONE:
      return state.setIn([action.payload.id, 'finished'], true) //.deleteIn([action.payload.id, 'subTasks'])
    
    case t.FS_WRITE_REMOVE_ACTION:
      return state.delete(action.payload.id)

    default:
      return state
  }
}