import { fromJS, Map } from 'immutable'
import * as t from './addon-bar-actiontypes'
import FsWrite from '../filesystem/write/fs-write-index'
import _ from 'lodash'

const INITIAL_STATE = fromJS({
  currentView: ""
})

export default function appReducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {
    
    case t.SET_VIEW:
      return state.set('currentView', action.payload.type)
    
    case FsWrite.actiontypes.FS_WRITE_ERROR:
      return state.set('currentView', 'fs-write')

    default:
      return state;
  }
}
