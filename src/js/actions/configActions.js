import {
  APP_TOGGLE_EDIT_MODE
  } from '../constants/action-types'

// http://redux.js.org/docs/basics/Actions.html
export function toggleEditMode(editMode) { // Action Creator
  return { // action
    type: APP_TOGGLE_EDIT_MODE,
    payload: {editMode : editMode}
  };
}
