import * as t from './fs-watch-actiontypes'
import App from '../../app/app-index'
import {OrderedMap, Map, List, Seq, fromJS} from 'immutable'
import fs from 'fs'
import nodePath from 'path'

const INITIAL_STATE = OrderedMap({})

export default function reducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case t.WATCHER_READING:
      return state.setIn([action.payload.path], fromJS({
          ready: false,
          files: null
        }))

    case t.WATCHER_READY:
      state = state.setIn([action.payload.path], Map({
          ready: true,
          files: _sort( _fromJSOrdered( action.payload.files ) )
        }))
      return state

    case t.WATCHER_CLOSE:
      return state.deleteIn([action.payload.path])

    case t.WATCHER_ERROR:
      return state.setIn([action.payload.path], fromJS({
          ready: false,
          files: null,
          error: action.payload.error
        }))

    case t.FILE_ADD:
      let files = state.getIn([action.payload.root, 'files'])
      files = files.set(action.payload.base, OrderedMap(action.payload))
      files = _sort(files)
      return state.setIn([action.payload.root, 'files'], files)

    case t.FILE_UNLINK:
      return state.deleteIn([action.payload.root, 'files', action.payload.base])

    case t.FILE_CHANGE:
      return state.setIn([action.payload.root, 'files', action.payload.base], OrderedMap(action.payload))

    default:
      return state;
  }
}

function _sort(orderedFiles) {
  return orderedFiles.sortBy(file => file.get('base')).sortBy(file => file.get('type'))
}



/**
 * as fromJS() but creats an orderedMap
 * https://github.com/facebook/immutable-js/wiki/Converting-from-JS-objects#custom-conversion
 * @param  {object} js
 * @returns {Immutable OrderedMap}
 */
function _fromJSOrdered(js) {
  if(
    typeof js !== 'object' || 
    js === null || 
    js instanceof fs.Stats // nodeFS.stats should not be convertet
  ) {
    return js
  } else {
    if(Array.isArray(js)) {
      return Seq(js).map(_fromJSOrdered).toList()
    } else {
      return Seq(js).map(_fromJSOrdered).toOrderedMap()
    }
  }
}