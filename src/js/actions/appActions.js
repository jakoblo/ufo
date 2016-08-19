import {
  APP_CHANGE_PATH
  } from '../constants/action-types'

// http://redux.js.org/docs/basics/Actions.html
export function changeAppPath(fromPath, toPath) { // Action Creator
  return { // action
    type: APP_CHANGE_PATH,
    payload: {fromPath : fromPath, toPath: toPath}
  };
}
