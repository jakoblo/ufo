import {
  NAVBAR_SELECTION_CHANGED,
  APP_CHANGE_PATH,
  NAVBAR_HIDE_GROUP,
  NAVBAR_REMOVE_GROUP_ITEM,
  NAVBAR_CHANGE_GROUP_TITLE
  } from '../constants/action-types'

// http://redux.js.org/docs/basics/Actions.html
export function changeSelection(fromPath) { // Action Creator
  return { // action
    type: APP_CHANGE_PATH,
    payload: {fromPath: fromPath}
  };
}

export function changeGroupName(groupID, newName) {
  return {
    type: NAVBAR_GROUP_NAME_CHANGED,
    payload: {groupID: groupID, newName: newName}
  };
}

export function hideGroup(groupID) { // Action Creator
  return { // action
    type: NAVBAR_HIDE_GROUP,
    payload: {groupID: groupID}
  };
}

export function changeGroupTitle(groupID, newTitle) { // Action Creator
  return { // action
    type: NAVBAR_CHANGE_GROUP_TITLE,
    payload: {groupID: groupID, newTitle: newTitle}
  };
}

export function removeGroupItem(groupID, itemID) { // Action Creator
  return { // action
    type: NAVBAR_REMOVE_GROUP_ITEM,
    payload: {
      groupID: groupID,
      itemID: itemID}
  };
}
