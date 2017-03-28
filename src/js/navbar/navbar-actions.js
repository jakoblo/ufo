//@flow
import storage from "electron-json-storage";
import drivelist from "drivelist";
import * as t from "./navbar-actiontypes";
import * as c from "./navbar-constants";
import { List, Map, fromJS } from "immutable";
import * as Model from "./navbar-models";
import * as Utils from "../utils/utils-index";
import * as bootActions from "../bootActions";
import { remote } from "electron";
import _ from "lodash";
import type { Action } from "../types";

export function saveNavbarToStorage() {
  return function(dispatch: Function, getState: Function) {
    console.log("save Favbar");
    let navbarState = getState()[c.NAME];

    // Dont save the Devices group, but keep the position in groupsOrder
    navbarState = navbarState
      .deleteIn(["groups", c.DISKS_GROUP_ID, "items"])
      .deleteIn(["groups", c.DISKS_GROUP_ID, "itemsOrder"])
      .delete("activeItem");

    storage.set(c.NAME, navbarState, error => {
      if (error) throw error;
    });
  };
}

export function loadNavbarfromStorage() {
  return function(dispatch: Function, getState: Function) {
    storage.get(c.NAME, function(error, data) {
      if (error || !data.groups || !data.groupsOrder) {
        dispatch(loadDefaultUserFolders());
        return;
      }

      dispatch({
        type: t.NAVBAR_LOAD_FROM_STORAGE,
        payload: {
          groups: data.groups,
          groupsOrder: data.groupsOrder
        }
      });

      drivelist.list((error, drives) => {
        if (error) {
          throw error;
        }

        const driveList = drives
          .filter(drive => {
            return drive.mountpoints && drive.mountpoints.length;
          })
          .map(drive => _.first(drive.mountpoints).path);

        dispatch(addGroupItems(c.DISKS_GROUP_ID, driveList));
      });
    });
  };
}

function loadDefaultUserFolders() {
  return function(dispatch: Function, getState: Function) {
    const app = remote.app;
    dispatch(
      addNavGroup("Favourites", [
        app.getPath("home"),
        app.getPath("desktop"),
        app.getPath("documents"),
        app.getPath("downloads"),
        app.getPath("music"),
        app.getPath("pictures"),
        app.getPath("videos")
      ])
    );
    dispatch(addNavGroup(c.DISKS_GROUP_NAME, [], [], null, false, false, true));
  };
}

export function toggleGroup(groupId: number): Action {
  // Action Creator
  return {
    // action
    type: t.NAVBAR_TOGGLE_GROUP,
    payload: { groupId: groupId }
  };
}

export function changeGroupTitle(groupId: number, newTitle: string) {
  // Action Creator
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.NAVBAR_CHANGE_GROUP_TITLE,
      payload: { groupId: groupId, newTitle: newTitle }
    });
    saveNavbarToStorage(getState());
  };
}

export function removeGroupItem(groupId: number, itemID: number) {
  // Action Creator
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.NAVBAR_REMOVE_GROUP_ITEM,
      payload: {
        groupId: groupId,
        itemID: itemID
      }
    });
    saveNavbarToStorage(getState());
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
  itemsOrder: Array<number> = [],
  position?: number,
  hidden?: boolean = false,
  loading?: boolean = false,
  diskGroup?: boolean = false
) {
  return function(dispatch: Function, getState: Function) {
    if (items) {
      dispatch({
        // action
        type: t.ADD_NAVGROUP,
        payload: {
          title: title,
          diskGroup: diskGroup,
          items: items,
          itemsOrder: itemsOrder,
          position: position,
          hidden: hidden
        }
      });

      if (!loading) saveNavbarToStorage(getState());
    }
  };
}

export function removeNavGroup(groupId: number) {
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.REMOVE_NAVGROUP,
      payload: { groupId: groupId }
    });

    saveNavbarToStorage(getState());
  };
}

export function moveNavGroup(dragPosition: number, hoverPosition: number) {
  return {
    type: t.MOVE_NAVGROUP,
    payload: { dragPosition: dragPosition, hoverPosition: hoverPosition }
  };
}

export function moveGroupItem(
  groupId: string,
  dragOriginPosition: number,
  overPosition: number
): Action {
  return {
    type: t.MOVE_GROUPITEM,
    payload: {
      groupId: groupId,
      dragOriginPosition: dragOriginPosition,
      overPosition: overPosition
    }
  };
}

export function addGroupItems(groupId: string, items: Array<string>) {
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.ADD_GROUP_ITEM,
      payload: {
        groupId: groupId,
        items: items
      }
    });
    if (groupId !== 0) saveNavbarToStorage(getState());
  };
}

/**
 * Normalize string array and Object to valid object array
 * don't if the new id assignement is necessary.. ?:/
 * little bit wirred
 */
// function getItemList(items: Array<any>) {
//   let itemList = [];
//   items.forEach(
//     function(element) {
//       if (_.isObject(element) && _.has(element, "path")) {
//         itemList.push(
//           Model.NavGroupItemRecord({
//             id: nextGroupItemId++,
//             path: element.path
//           })
//         );
//       } else if (typeof element == "string") {
//         itemList.push(
//           Model.NavGroupItemRecord({ id: nextGroupItemId++, path: element })
//         );
//       }
//     },
//     this
//   );
//   return itemList;
// }
