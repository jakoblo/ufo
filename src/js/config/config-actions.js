import * as t from './config-actiontypes'
import App from '../app/app-index'
import Navbar from '../navbar/navbar-index'
import Utils from '../utils/utils-index'
import { List, Map } from 'immutable'
import { ActionCreators } from 'redux-undo';
import os from 'os'

export function loadPreviousState(windowID) {
  return dispatch => {
    /**
     * Loads NAVBAR GroupItems from Storage
     */
    Utils.storage.loadNavbarfromStorage(function (data) {
      if (data.groupItems !== undefined) {
        data.groupItems.forEach((item, index) => {
          dispatch(Navbar.actions.addNavGroup(item.title, item.items))
        })
      }
    })
    /**
     * Loads the last Redux STATE from Storage
     */
    Utils.storage.loadStatefromStorage(windowID, function (data) {
      console.log(data);
      // if(data.fs)
      dispatch(App.actions.changeAppPath('//dev/disk1'))
    })
    dispatch(ActionCreators.clearHistory())
  }
}

export function toggleEditMode(editMode) { // Action Creator
  return { // action
    type: t.APP_TOGGLE_EDIT_MODE,
    payload: {editMode : editMode}
  };
}
