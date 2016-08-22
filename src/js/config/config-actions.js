import * as t from './config-actiontypes'

// http://redux.js.org/docs/basics/Actions.html
export function toggleEditMode(editMode) { // Action Creator
  return { // action
    type: t.APP_TOGGLE_EDIT_MODE,
    payload: {editMode : editMode}
  };
}
