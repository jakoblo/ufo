import * as t from './navbar-actiontypes'
import { List, Map, fromJS } from 'immutable'
import * as Utils from '../utils/utils-index'
import _ from 'lodash'

let nextNavGroupId = 1
let nextGroupItemId = 0

export function saveFavbartoStorage() {
  return function(dispatch, getState) {
    Utils.storage.saveFavbartoStorage(getState())
  }
}

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

export function removeGroupItem(groupID, itemID) { // Action Creator
  return function(dispatch, getState) {
    dispatch( 
      {type: t.NAVBAR_REMOVE_GROUP_ITEM,
      payload: {
        groupID: groupID,
        itemID: itemID}
      }
    )
    Utils.storage.saveFavbartoStorage(getState())
  }
}

export function removeGroupItemfromDeviceGroup(fileObj) {
  return function(dispatch, state) {
    dispatch({type: t.REMOVE_DISKGROUP_ITEM,
    payload: {
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
export function addNavGroup(title, items, position, hidden, loading, diskGroup) { 
  return function(dispatch, getState) {

    dispatch({ // action
      type: t.ADD_NAVGROUP,
      payload: {id: diskGroup ? 0 : nextNavGroupId++, title: title, items: getItemList(items), position: position, hidden: hidden}
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

export function moveNavGroup(dragIndex, hoverIndex) {
  return function(dispatch, getState) {
    dispatch({
      type: t.MOVE_NAVGROUP,
      payload: {dragIndex: dragIndex, hoverIndex: hoverIndex}
    })
  }
}

export function moveGroupItem(groupIndex, dragIndex, hoverIndex) {
  return {
    type: t.MOVE_GROUPITEM,
    payload: {groupIndex: groupIndex, dragIndex: dragIndex, hoverIndex: hoverIndex}
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
export function addGroupItems(groupID, items) {
  return function(dispatch, getState) {
    let itemArray = items
    if(!_.isArray(items))
      itemArray = [items]

    dispatch(
      {type: t.ADD_GROUP_ITEM,
      payload: {
          groupID: groupID,
          items: getItemList(itemArray)
        }
      }
    )
    if(groupID !== 0)
    Utils.storage.saveFavbartoStorage(getState())
  }

}

function getItemList(items) {
  
  let itemList = []
  items.forEach(function(element) {
    if(_.isObject(element) && _.has(element, 'path')) {
    itemList.push({id: nextGroupItemId++, path: element.path})
    } else {
    itemList.push({id: nextGroupItemId++, path: element})
    }
  }, this)
  return fromJS(itemList)
}
