//@flow

import * as t from "./navbar-actiontypes";
import { List, Map, fromJS } from "immutable";
import * as Utils from "../utils/utils-index";
import _ from "lodash";

import type { Action } from "../types";

let nextNavGroupId = 1;
let nextGroupItemId = 0;

export function saveFavbartoStorage() {
  return function(dispatch: Function, getState: Function) {
    Utils.storage.saveFavbartoStorage(getState());
  };
}

export function toggleGroup(groupID: number): Action {
  // Action Creator
  return {
    // action
    type: t.NAVBAR_TOGGLE_GROUP,
    payload: { groupID: groupID }
  };
}

export function changeGroupTitle(groupID: number, newTitle: string) {
  // Action Creator
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.NAVBAR_CHANGE_GROUP_TITLE,
      payload: { groupID: groupID, newTitle: newTitle }
    });
    Utils.storage.saveFavbartoStorage(getState());
  };
}

export function removeGroupItem(groupID: number, itemID: number) {
  // Action Creator
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.NAVBAR_REMOVE_GROUP_ITEM,
      payload: {
        groupID: groupID,
        itemID: itemID
      }
    });
    Utils.storage.saveFavbartoStorage(getState());
  };
}

export function removeGroupItemfromDeviceGroup(fileObj: any) {
  return function(dispatch: Function, state: Function) {
    dispatch({
      type: t.REMOVE_DISKGROUP_ITEM,
      payload: {
        fileObj: fileObj
      }
    });
  };
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
export function addNavGroup(
  title: string,
  items: Array<string>,
  position?: number,
  hidden?: boolean,
  loading?: boolean,
  diskGroup?: boolean
) {
  return function(dispatch: Function, getState: Function) {
    if (items)
      dispatch({
        // action
        type: t.ADD_NAVGROUP,
        payload: {
          id: diskGroup ? 0 : nextNavGroupId++,
          title: title,
          items: getItemList(items),
          position: position,
          hidden: hidden
        }
      });

    if (loading == undefined) Utils.storage.saveFavbartoStorage(getState());
  };
}

export function removeNavGroup(groupIndex: number) {
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.REMOVE_NAVGROUP,
      payload: { groupIndex: groupIndex }
    });

    Utils.storage.saveFavbartoStorage(getState());
  };
}

export function moveNavGroup(dragIndex: number, hoverIndex: number) {
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.MOVE_NAVGROUP,
      payload: { dragIndex: dragIndex, hoverIndex: hoverIndex }
    });
  };
}

export function moveGroupItem(
  groupIndex: number,
  dragIndex: number,
  hoverIndex: number
): Action {
  return {
    type: t.MOVE_GROUPITEM,
    payload: {
      groupIndex: groupIndex,
      dragIndex: dragIndex,
      hoverIndex: hoverIndex
    }
  };
}

export function addGroupItems(groupID: number, items: Array<string>) {
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.ADD_GROUP_ITEM,
      payload: {
        groupID: groupID,
        items: getItemList(items)
      }
    });
    if (groupID !== 0) Utils.storage.saveFavbartoStorage(getState());
  };
}

/**
 * Normalize string array and Object to valid object array
 * don't if the new id assignement is necessary.. ?:/
 * little bit wirred
 */
function getItemList(items: Array<any>) {
  let itemList = [];
  items.forEach(
    function(element) {
      if (_.isObject(element) && _.has(element, "path")) {
        itemList.push({ id: nextGroupItemId++, path: element.path });
      } else if (typeof element == "string") {
        itemList.push({ id: nextGroupItemId++, path: element });
      }
    },
    this
  );
  return fromJS(itemList);
}
