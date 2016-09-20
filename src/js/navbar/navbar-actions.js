import * as t from './navbar-actiontypes'
import { List, Map } from 'immutable'
import * as Utils from '../utils/utils-index'
import _ from 'lodash'

let nextNavGroupId = 0

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

/**
 * 
 * NAVGROUP
 * @export
 * @param {string} title
 * @param {array} items
 * @param {boolean} loading
 * @returns
 */
export function addNavGroup(title, items, position, hidden, loading) { 
  return function(dispatch, getState) {
    dispatch({ // action
      type: t.ADD_NAVGROUP,
      payload: {id: nextNavGroupId++, title: title, items: List(items), position: position, hidden: hidden}
    })

    if(loading == undefined)
      Utils.storage.saveFavbartoStorage(getState())
  } 
}

export function removeNavGroup(groupIndex) {
  return function(dispatch, getState) {
    dispatch({
      type: t.REMOVE_NAVGROUP,
      payload: { groupIndex: groupIndex }
    })

    Utils.storage.saveFavbartoStorage(getState())
  }
}

/**
 * 
 * 
 * @export
 * @param {number} groupIndex
 * @param {array, string} items
 * @returns
 */
export function addGroupItems(groupIndex, items) {
  return function(dispatch, getState) {
    let itemArray = items
    if(!_.isArray(items))
      itemArray = [items]

    dispatch(
      {type: t.ADD_GROUP_ITEM,
      payload: {
          groupIndex: groupIndex,
          items: itemArray
        }
      }
    )

    Utils.storage.saveFavbartoStorage(getState())
  }

}
