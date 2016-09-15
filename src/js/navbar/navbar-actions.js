import * as t from './navbar-actiontypes'
import { List, Map } from 'immutable'
import Utils from '../utils/utils-index'

export function toggleGroup(groupID) { // Action Creator
  return { // action
    type: t.NAVBAR_TOGGLE_GROUP,
    payload: {groupID: groupID}
  };
}

export function changeGroupTitle(groupID, newTitle) { // Action Creator
  return function (dispatch, getState) {
    dispatch({
    type: t.NAVBAR_CHANGE_GROUP_TITLE,
    payload: {groupID: groupID, newTitle: newTitle}
    })
    Utils.storage.saveFavbartoStorage(getState())
  }
}

export function removeGroupItem(groupIndex, itemID) { // Action Creator
  return function(dispatch, getState) {
    dispatch( 
      {type: t.NAVBAR_REMOVE_GROUP_ITEM,
      payload: {
        groupIndex: groupIndex,
        itemID: itemID}
      }
    )
    Utils.storage.saveFavbartoStorage(getState())
  }
}

export function removeGroupItemfromDeviceGroup(groupTitle, fileObj) {
  return function(dispatch, state) {
    dispatch({type: t.REMOVE_DEVICE_ITEM,
    payload: {
      groupTitle: groupTitle,
      fileObj: fileObj
    }})
  }
}

export function addNavGroup(title, items, loading) { 
  return function(dispatch, getState) {
    dispatch({ // action
      type: t.ADD_NAVGROUP,
      payload: {title: title, items: List(items)}
    })
      
    if(loading == undefined)
      Utils.storage.saveFavbartoStorage(getState())
  } 
}

export function addGroupItems(groupIndex, items) {
  return function(dispatch, state) {
    dispatch(
      {type: t.ADD_GROUP_ITEM,
      payload: {
          groupIndex: groupIndex,
          items: items
        }
      }
    )
  }

}
