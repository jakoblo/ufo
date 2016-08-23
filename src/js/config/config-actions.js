import * as t from './config-actiontypes'
import App from '../app/app-index'
import Navbar from '../navbar/navbar-index'
import Utils from '../utils/utils-index'
import { List, Map } from 'immutable'
import { ActionCreators } from 'redux-undo';

export function loadPreviousState(windowID) {

  return dispatch => {
    Utils.storage.loadStatefromStorage(windowID, function(data) {
  
      // if(data.navbar)
    if(data.navbar !== undefined) {
      data.navbar.present.groupItems.forEach((item, index) => {
        dispatch(Navbar.actions.addNavGroup(item.title, item.items))
      })
    }
    if(data.fs !== undefined) {
      
    }

      dispatch(ActionCreators.clearHistory())
  })


    // dispatch(App.actions.changeAppPath())

    // dispatch(Navbar.actions.addNavGroup())
  }

}

export function toggleEditMode(editMode) { // Action Creator
  return { // action
    type: t.APP_TOGGLE_EDIT_MODE,
    payload: {editMode : editMode}
  };
}
