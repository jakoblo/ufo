import { fromJS, Map } from 'immutable'
import * as t from './addon-bar-actiontypes'
import _ from 'lodash'

const INITIAL_STATE = fromJS({
  currentView: "fs-write"
})

export default function appReducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {
    
    case t.SET_VIEW:
      return state.set('currentView', action.payload.type)

    default:
      return state;
  }
}
