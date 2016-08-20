"use strict"
import {
  NAVBAR_SELECTION_CHANGED,
  APP_CHANGE_PATH,
  NAVBAR_HIDE_GROUP,
  NAVBAR_REMOVE_GROUP_ITEM,
  NAVBAR_CHANGE_GROUP_TITLE
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
    case APP_CHANGE_PATH:
      return state.set('activeItem', action.payload.fromPath)
      break;
    case NAVBAR_HIDE_GROUP:
      let hidden = state.getIn(['groupItems', action.payload.groupID, 'hidden'])
      return state.setIn(['groupItems', action.payload.groupID, 'hidden'], !hidden)
      break;
    case NAVBAR_REMOVE_GROUP_ITEM:
      return state.deleteIn(['groupItems', action.payload.groupID, 'items', action.payload.itemID])
      break;
    case NAVBAR_CHANGE_GROUP_TITLE:
      return state.setIn(['groupItems', action.payload.groupID, 'title'], action.payload.newTitle)
      break;
    default:
      return state;
  }
}
