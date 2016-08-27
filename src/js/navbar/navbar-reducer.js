"use strict"
import * as t from './navbar-actiontypes'
import App from '../app/app-index'
import Immutable from 'immutable'
import { Map, List } from 'immutable'

// const INITIAL_STATE = Immutable.fromJS({groupItems: [
//     {title: "FavGroup 1", hidden: false, items: ["/", "/Users/jakoblo/Desktop"]},
//     {title: "FavGroup 2", hidden: false, items: ["/Users/jakoblo/Documents", "/Users/jakoblo/Downloads", "/Users/jakoblo/Applications"]}
//   ],
//   activeItem: ''
// })

const INITIAL_STATE = Map({groupItems: List(), activeItem: ''})

export default function navbarReducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {
    case App.actiontypes.APP_CHANGE_PATH:
      return state.set('activeItem', action.payload.pathRoute[0])

    case t.NAVBAR_TOGGLE_GROUP:
      let hidden = state.getIn(['groupItems', action.payload.groupID, 'hidden'])
      return state.setIn(['groupItems', action.payload.groupID, 'hidden'], !hidden)

    case t.NAVBAR_REMOVE_GROUP_ITEM:
      const groupIndex = state.get('groupItems').findIndex(group => group.get('title') === action.payload.groupTitle)
      return state.deleteIn(['groupItems', action.payload.groupID, 'items', action.payload.itemID])

    case t.NAVBAR_CHANGE_GROUP_TITLE:
      return state.setIn(['groupItems', action.payload.groupID, 'title'], action.payload.newTitle)

    case t.ADD_NAVGROUP:
      return state.set('groupItems', state.get('groupItems').push(Map({title: action.payload.title, hidden: false, items: action.payload.items})))
    
    case t.ADD_GROUP_ITEM:
      const groupIndex = state.get('groupItems').findIndex(group => group.get('title') === action.payload.groupTitle)
      let newItems = state.getIn(['groupItems', groupIndex, 'items']).push(action.payload.item)
      return state.setIn(['groupItems', groupIndex, 'items'], newItems)

    default:
      return state;
  }
}
