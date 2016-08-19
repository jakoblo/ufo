"use strict"
import {
  NAVBAR_SELECTION_CHANGED,
  APP_CHANGE_PATH,
  NAVBAR_GROUP_NAME_CHANGED
} from '../constants/action-types'

import Immutable from 'immutable'
import { List } from 'immutable'

const INITIAL_STATE = Immutable.fromJS({groupItems: [
    {title: "Favbar 1", items: ["/Users/jakoblo/Applications", "/Users/jakoblo/Desktop"]},
    {title: "Favbar 2", items: ["/Users/jakoblo/Documents", "/Users/jakoblo/Downloads"]}
  ],
  activeGroup: 0,
  activeItem: 0
})

export function navbarReducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {
    case NAVBAR_GROUP_NAME_CHANGED:
      console.log(state.get('groupItems'))
      return state.setIn(['groupItems', action.payload.groupID, 'title'], action.payload.newName)
      // return state.groupItems.setIn([0, 'name'], 'HUgo')
      break;
    case APP_CHANGE_PATH:
      return state.set('activeGroup', action.payload.groupID).set('activeItem', action.payload.itemID)
      break;
    default:
      return state;
  }
}
