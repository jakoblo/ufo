import * as t from './navbar-actiontypes'
import { List, Map } from 'immutable'

export function toggleGroup(groupID) { // Action Creator
  return { // action
    type: t.NAVBAR_TOGGLE_GROUP,
    payload: {groupID: groupID}
  };
}

export function changeGroupTitle(groupID, newTitle) { // Action Creator
  return { // action
    type: t.NAVBAR_CHANGE_GROUP_TITLE,
    payload: {groupID: groupID, newTitle: newTitle}
  };
}

export function removeGroupItem(group, itemID) { // Action Creator
  return { // action
    type: t.NAVBAR_REMOVE_GROUP_ITEM,
    payload: {
      groupID: group,
      itemID: itemID}
  };
}

export function addNavGroup(title, items) { 
  return { // action
    type: t.ADD_NAVGROUP,
    payload: {title: title, items: List(items)}
  };
}

export function addGroupItem(groupTitle, item) {
  return {
    type: t.ADD_GROUP_ITEM,
    payload: {
      groupTitle: groupTitle,
      item: item.path
    }
  }
}