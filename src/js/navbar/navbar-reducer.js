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
      return state.deleteIn(['groupItems', action.payload.groupIndex, 'items', action.payload.itemID])

    case t.REMOVE_DEVICE_ITEM:
      const deviceGroupIndex = state.get('groupItems').findIndex(group => group.get('title') === action.payload.groupTitle)
      const deviceGroupItem = state.getIn(['groupItems', deviceGroupIndex, 'items']).findIndex(item => item === action.payload.fileObj.path)
      return state.deleteIn(['groupItems', deviceGroupIndex, 'items', deviceGroupItem])

    case t.NAVBAR_CHANGE_GROUP_TITLE:
      return state.setIn(['groupItems', action.payload.groupID, 'title'], action.payload.newTitle)

    case t.ADD_NAVGROUP:
    console.log(action.payload.position + " " + action.payload.title)
    if(action.payload.position != undefined) {
      return state.set('groupItems', state.get('groupItems').insert(action.payload.position, Map({title: action.payload.title, hidden: false, items: action.payload.items})))
    } else {
      return state.set('groupItems', state.get('groupItems').push(Map({title: action.payload.title, hidden: false, items: action.payload.items})))
    }    
    
    case t.ADD_GROUP_ITEM:
      let newItems = state.getIn(['groupItems', action.payload.groupIndex, 'items']).push(...action.payload.items)
      return state.setIn(['groupItems', action.payload.groupIndex, 'items'], newItems)

    default:
      return state;
  }
}
