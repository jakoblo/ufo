import {
  NAVBAR_SELECTION_CHANGED,
  APP_CHANGE_PATH,
  NAVBAR_GROUP_NAME_CHANGED
  } from '../constants/action-types'

// http://redux.js.org/docs/basics/Actions.html
export function changeSelection(newPath, groupID, itemID) { // Action Creator
  return { // action
    type: APP_CHANGE_PATH,
    payload: {newPath: newPath, groupID : groupID, itemID: itemID}
  };
}

export function changeGroupName(groupID, newName) {
  return {
    type: NAVBAR_GROUP_NAME_CHANGED,
    payload: {groupID: groupID, newName: newName}
  };
}
