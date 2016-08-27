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

export function removeGroupItem(groupIndex, itemID) { // Action Creator
  return { // action
    type: t.NAVBAR_REMOVE_GROUP_ITEM,
    payload: {
      groupIndex: groupIndex,
      itemID: itemID}
  };
}

export function removeGroupItemfromDeviceGroup(groupTitle, fileObj) {
  return {
    type: t.REMOVE_DEVICE_ITEM,
    payload: {
      groupTitle: groupTitle,
      fileObj: fileObj
    }
  }
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