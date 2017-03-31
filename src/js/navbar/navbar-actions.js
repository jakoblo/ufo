//@flow
import storage from "electron-json-storage";
import { remote } from "electron";
import _ from "lodash";
import nodePath from "path";
import drivelist from "drivelist";
import DrivelistWatcher from "drivelist-watcher";
import * as Storage from "../utils/storage";
import * as t from "./navbar-actiontypes";
import * as c from "./navbar-constants";

import type { GroupItem, ActionGroupItems } from "./navbar-types";
import type { Action } from "../types";

let driveScanner;

Storage.register(c.NAME, groupsSave, groupsLoad);

export function groupsSave(state: any) {
  let navbarState = state[c.NAME];
  let diskGrouPosition = navbarState
    .get("groups")
    .findIndex(group => group.id == c.DISKS_GROUP_ID);

  // Device Group Items cant be saved
  navbarState = navbarState
    .deleteIn(["groups", diskGrouPosition, "items"])
    .delete("activeItem");

  return navbarState.toJS();
}

export function groupsLoad(data: Object | boolean) {
  return (dispatch: Function, getState: Function) => {
    if (typeof data == "object") {
      dispatch({
        type: t.NAVBAR_LOAD_FROM_STORAGE,
        payload: {
          groups: data.groups
        }
      });
    } else {
      dispatch(groupsCreateDefault());
    }
    dispatch(drivesInit());
  };
}

function groupsCreateDefault() {
  return function(dispatch: Function, getState: Function) {
    const app = remote.app;
    dispatch(
      groupCreate("Favourites", [
        getItemFromPath(app.getPath("home")),
        getItemFromPath(app.getPath("desktop")),
        getItemFromPath(app.getPath("documents")),
        getItemFromPath(app.getPath("downloads")),
        getItemFromPath(app.getPath("music")),
        getItemFromPath(app.getPath("pictures")),
        getItemFromPath(app.getPath("videos"))
      ])
    );
    dispatch(groupCreate(c.DISKS_GROUP_NAME, [], null, false, false, true));
  };
}

export function drivesInit() {
  return function(dispatch: Function, getState: Function) {
    drivelist.list((error, drives) => {
      if (error) {
        throw error;
      }
      dispatch(drivesSet(drives));
    });

    driveScanner = new DrivelistWatcher({
      callbackDeviceAdded: drives => {
        dispatch(drivesSet(drives));
      },
      callbackDeviceRemoved: drives => {
        dispatch(drivesSet(drives));
      },
      intervalTime: 5000
    });
  };
}

function drivesSet(drives) {
  return function(dispatch: Function, getState: Function) {
    const drivesPosition = groupPosFromId(getState(), c.DISKS_GROUP_ID);
    dispatch(
      groupSetItems(
        drivesPosition,
        drives
          .filter(drive => {
            return drive.mountpoints && drive.mountpoints.length;
          })
          .map(drive => ({
            type: c.ITEM_TYPE_DEVICE,
            path: _.first(drive.mountpoints).path,
            name: drive.description
          }))
      )
    );
  };
}

function groupSetItems(groupPosition, items) {
  return {
    type: t.NAVBAR_ITEMS_SET,
    payload: {
      groupPosition: groupPosition,
      items: items
    }
  };
}

export function groupCreate(
  title: string,
  items: ActionGroupItems,
  position?: number | null,
  hidden?: boolean = false,
  loading?: boolean = false,
  diskGroup?: boolean = false
) {
  return function(dispatch: Function, getState: Function) {
    const state = getState();
    dispatch({
      type: t.NAVBAR_GROUP_CREATE,
      payload: {
        title: title,
        diskGroup: diskGroup,
        items: items,
        position: position,
        hidden: hidden
      }
    });
  };
}
export function groupCreate__fileList(
  title: string,
  fileList: Array<string>,
  position?: number | null,
  hidden?: boolean = false,
  loading?: boolean = false,
  diskGroup?: boolean = false
) {
  return function(dispatch: Function, getState: Function) {
    const items = fileList.map(path => getItemFromPath(path));
    dispatch(groupCreate(title, items, position, hidden, loading, diskGroup));
  };
}

export function groupToggle(groupPosition: number): Action {
  return {
    type: t.NAVBAR_GROUP_TOGGLE,
    payload: { groupPosition: groupPosition }
  };
}

export function groupTitleChange(groupPosition: number, newTitle: string) {
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.NAVBAR_GROUP_TITLE_CHANGE,
      payload: { groupPosition: groupPosition, newTitle: newTitle }
    });
  };
}

export function groupRemove(groupPosition: number) {
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.NAVBAR_GROUP_REMOVE,
      payload: { groupPosition: groupPosition }
    });
  };
}

export function groupMove(fromPosition: number, toPosition: number) {
  return {
    type: t.NAVBAR_GROUP_MOVE,
    payload: { fromPosition: fromPosition, toPosition: toPosition }
  };
}

export function itemsCreate_fromPath(
  groupPosition: number,
  pathList: Array<string>
) {
  return function(dispatch: Function, getState: Function) {
    dispatch(
      itemsCreate(groupPosition, pathList.map(path => getItemFromPath(path)))
    );
  };
}

export function itemsCreate(groupPosition: number, items: ActionGroupItems) {
  return function(dispatch: Function, getState: Function) {
    const state = getState();
    const newItems = items.filter(newItem =>
      itemDoesNotExist(state, groupPosition, newItem));
    dispatch({
      type: t.NAVBAR_ITEMS_CREATE,
      payload: {
        groupPosition: groupPosition,
        items: newItems
      }
    });
  };
}

export function itemRemove(groupPosition: number, itemPosition: number) {
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.NAVBAR_ITEM_REMOVE,
      payload: {
        groupPosition: groupPosition,
        itemPosition: itemPosition
      }
    });
  };
}

export function itemMove(
  groupPosition: number,
  itemFromPosition: number,
  itemToPosition: number
): Action {
  return {
    type: t.NAVBAR_ITEM_MOVE,
    payload: {
      groupPosition: groupPosition,
      itemFromPosition: itemFromPosition,
      itemToPosition: itemToPosition
    }
  };
}

function getItemFromPath(path) {
  return {
    path: path,
    type: nodePath.extname(path).length > 0
      ? c.ITEM_TYPE_FILE
      : c.ITEM_TYPE_FOLDER,
    name: nodePath.basename(path)
  };
}

const groupPosFromId = (state: any, groupId: string): number => {
  return state[c.NAME].get("groups").findIndex(group => group.id === groupId);
};

function itemDoesNotExist(
  state: any,
  groupPosition: number,
  item: GroupItem
): boolean {
  return state[c.NAME]
    .getIn(["groups", groupPosition, "items"])
    .findIndex(existingItem => existingItem.path == item.path) < 0;
}
