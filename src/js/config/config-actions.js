import * as t from './config-actiontypes'
import App from '../app/app-index'
import Navbar from '../navbar/navbar-index'
import * as Utils from '../utils/utils-index'
import * as selectors from './config-selectors'
import { List, Map } from 'immutable'
import os from 'os' 
import _ from 'lodash'

export function loadPreviousState(windowID) {
  return dispatch => {
    /**
     * Loads NAVBAR GroupItems from Storage
     */
    
    Utils.storage.loadNavbarfromStorage(function (data) {
      let diskGroupPosition = 1
      if (data.groupItems !== undefined) {
        data.groupItems.forEach((item, index) => {
          if(item.title != Navbar.constants.DISKS_GROUP_NAME) {
          dispatch(Navbar.actions.addNavGroup(item.title, item.items, index, item.hidden, true))
          } else {
            diskGroupPosition = index 
          }   
        })

        Utils.storage.loadSystemVolumes(
          // Devices/Disk Group always gets a fixed ID of 0
        (fileObj) => {dispatch(Navbar.actions.addGroupItems(0, fileObj.path))},
        (fileObj, activeWatcher) => {dispatch(Navbar.actions.removeGroupItemfromDeviceGroup(fileObj))},
        (fileObj) => {},
        (title, items) =>  {dispatch(Navbar.actions.addNavGroup(title, items, diskGroupPosition, false, true, true))}
        )
      }
    })
    // if(devicesPosition == undefined)
    /**
     * Loads the last Redux STATE from Storage
     */
    Utils.storage.loadStatefromStorage(windowID, function (data) {
      // if(data.fs)
      dispatch(App.actions.changeAppPath(os.homedir()))
    })
  }
}

export function toggleReadOnly() {
  return (dispatch, getState) => {
    dispatch({
      type: t.APP_READ_ONLY_TOGGLE,
      payload: {
        readOnly: ( !selectors.getReadOnlyState(getState()) )
      }
    })
  }
}
