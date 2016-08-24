import * as t from './navbar-actiontypes'
import { List, Map } from 'immutable'

export function hideGroup(groupID) { // Action Creator
  return { // action
    type: t.NAVBAR_HIDE_GROUP,
    payload: {groupID: groupID}
  };
}

export function changeGroupTitle(groupID, newTitle) { // Action Creator
  return { // action
    type: t.NAVBAR_CHANGE_GROUP_TITLE,
    payload: {groupID: groupID, newTitle: newTitle}
  };
}

export function removeGroupItem(groupID, itemID) { // Action Creator
  return { // action
    type: t.NAVBAR_REMOVE_GROUP_ITEM,
    payload: {
      groupID: groupID,
      itemID: itemID}
  };
}

export function addNavGroup(title, items) { 
  return { // action
    type: t.ADD_NAVGROUP,
    payload: {title: title, items: List(items)}
  };
}