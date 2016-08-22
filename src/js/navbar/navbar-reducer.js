"use strict"
import * as t from './navbar-actiontypes'
import * as appTypes from '../app/app-actiontypes'
import Immutable from 'immutable'
import { List } from 'immutable'

const INITIAL_STATE = Immutable.fromJS({groupItems: [
    {title: "FavGroup 1", hidden: false, items: ["/", "/Users/jakoblo/Desktop"]},
    {title: "FavGroup 2", hidden: false, items: ["/Users/jakoblo/Documents", "/Users/jakoblo/Downloads", "/Users/jakoblo/Applications"]}
  ],
  activeItem: ''
})

export default function navbarReducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {
    case appTypes.APP_CHANGE_PATH:
      return state.set('activeItem', action.payload.pathRoute[0])
      break;
    case t.NAVBAR_HIDE_GROUP:
      let hidden = state.getIn(['groupItems', action.payload.groupID, 'hidden'])
      return state.setIn(['groupItems', action.payload.groupID, 'hidden'], !hidden)
      break;
    case t.NAVBAR_REMOVE_GROUP_ITEM:
      return state.deleteIn(['groupItems', action.payload.groupID, 'items', action.payload.itemID])
      break;
    case t.NAVBAR_CHANGE_GROUP_TITLE:
      return state.setIn(['groupItems', action.payload.groupID, 'title'], action.payload.newTitle)
      break;
    default:
      return state;
  }
}
