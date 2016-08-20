"use strict"
import {
  NAVBAR_SELECTION_CHANGED,
  APP_CHANGE_PATH,
  NAVBAR_GROUP_NAME_CHANGED,
  NAVBAR_HIDE_GROUP
} from '../constants/action-types'

import Immutable from 'immutable'
import { List } from 'immutable'

const INITIAL_STATE = Immutable.fromJS({groupItems: [
    {title: "Favbar 1", hidden: false, items: ["/Users/jakoblo/Applications", "/Users/jakoblo/Desktop"]},
    {title: "Favbar 2", hidden: false, items: ["/Users/jakoblo/Documents", "/Users/jakoblo/Downloads", "/Users/jakoblo/Applications"]}
  ],
  activeItem: ''
})

export function navbarReducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {
    case NAVBAR_GROUP_NAME_CHANGED:
      console.log(state.get('groupItems'))
      return state.setIn(['groupItems', action.payload.groupID, 'title'], action.payload.newName)
      // return state.groupItems.setIn([0, 'name'], 'HUgo')
      break;
    case APP_CHANGE_PATH:
      return state.set('activeItem', action.payload.fromPath)
      break;
    case NAVBAR_HIDE_GROUP:
      let hidden = state.getIn(['groupItems', action.payload.groupID, 'hidden'])
      return state.setIn(['groupItems', action.payload.groupID, 'hidden'], !hidden)
      break;
    default:
      return state;
  }
}
