//@flow
import storage from "electron-json-storage";
import drivelist from "drivelist";
import * as t from "./navbar-actiontypes";
import * as c from "./navbar-constants";
import { List, Map, fromJS } from "immutable";
import * as Model from "./navbar-models";
import * as Utils from "../utils/utils-index";
import { remote } from "electron";
import _ from "lodash";
import type { GroupItem, ActionGroupItems } from "./navbar-types";
import type { Action } from "../types";
import nodePath from "path";

export function saveNavbarToStorage() {
  return function(dispatch: Function, getState: Function) {
    console.log("save Favbar");
    let navbarState = getState()[c.NAME];
    let diskGrouPosition = navbarState
      .get("groups")
      .findIndex(group => group.id == c.DISKS_GROUP_ID);

    // Device Group Items cant be saved
    navbarState = navbarState
      .deleteIn(["groups", diskGrouPosition, "items"])
      .delete("activeItem");

    storage.set(c.NAME, navbarState, error => {
      if (error) throw error;
    });
  };
}

export function loadNavbarfromStorage() {
  return function(dispatch: Function, getState: Function) {
    storage.get(c.NAME, function(error, data) {
      if (error || !data.groups) {
        dispatch(loadDefaultUserFolders());
      } else {
        dispatch({
          type: t.NAVBAR_LOAD_FROM_STORAGE,
          payload: {
            groups: data.groups
          }
        });
      }

      drivelist.list((error, drives) => {
        if (error) {
          throw error;
        }

        const driveList = drives
          .filter(drive => {
            return drive.mountpoints && drive.mountpoints.length;
          })
          .map(drive => ({
            type: c.ITEM_TYPE_DEVICE,
            path: _.first(drive.mountpoints).path,
            name: drive.description
          }));

        console.log(drives);
        console.log(driveList);

        const drivesPosition = groupPosFromId(getState(), c.DISKS_GROUP_ID);

        dispatch(addGroupItems(drivesPosition, driveList));
      });
    });
  };
}

function loadDefaultUserFolders() {
  return function(dispatch: Function, getState: Function) {
    const app = remote.app;
    dispatch(
      addNavGroup("Favourites", [
        itemFromPath(app.getPath("home")),
        itemFromPath(app.getPath("desktop")),
        itemFromPath(app.getPath("documents")),
        itemFromPath(app.getPath("downloads")),
        itemFromPath(app.getPath("music")),
        itemFromPath(app.getPath("pictures")),
        itemFromPath(app.getPath("videos"))
      ])
    );
    dispatch(addNavGroup(c.DISKS_GROUP_NAME, [], null, false, false, true));
  };
}

export function toggleGroup(groupPosition: number): Action {
  return {
    type: t.NAVBAR_TOGGLE_GROUP,
    payload: { groupPosition: groupPosition }
  };
}

export function changeGroupTitle(groupPosition: number, newTitle: string) {
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.NAVBAR_CHANGE_GROUP_TITLE,
      payload: { groupPosition: groupPosition, newTitle: newTitle }
    });
  };
}

export function removeGroupItem(groupPosition: number, itemPosition: number) {
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.NAVBAR_REMOVE_GROUP_ITEM,
      payload: {
        groupPosition: groupPosition,
        itemPosition: itemPosition
      }
    });
  };
}

export function addNavGroup(
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
      type: t.ADD_NAVGROUP,
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
export function addNavGroup__fileList(
  title: string,
  fileList: Array<string>,
  position?: number | null,
  hidden?: boolean = false,
  loading?: boolean = false,
  diskGroup?: boolean = false
) {
  return function(dispatch: Function, getState: Function) {
    const items = fileList.map(path => itemFromPath(path));
    dispatch(addNavGroup(title, items, position, hidden, loading, diskGroup));
  };
}

export function removeNavGroup(groupPosition: number) {
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.REMOVE_NAVGROUP,
      payload: { groupPosition: groupPosition }
    });
  };
}

export function moveNavGroup(dragPosition: number, hoverPosition: number) {
  return {
    type: t.MOVE_NAVGROUP,
    payload: { dragPosition: dragPosition, hoverPosition: hoverPosition }
  };
}

export function moveGroupItem(
  groupPosition: number,
  itemFromPosition: number,
  itemToPosition: number
): Action {
  return {
    type: t.MOVE_GROUPITEM,
    payload: {
      groupPosition: groupPosition,
      itemFromPosition: itemFromPosition,
      itemToPosition: itemToPosition
    }
  };
}

export function addGroupItemsFromPathList(
  groupPosition: number,
  pathList: Array<string>
) {
  return function(dispatch: Function, getState: Function) {
    dispatch(
      addGroupItems(groupPosition, pathList.map(path => itemFromPath(path)))
    );
  };
}

export function addGroupItems(groupPosition: number, items: ActionGroupItems) {
  return function(dispatch: Function, getState: Function) {
    const state = getState();
    const newItems = items.filter(newItem =>
      itemDoesNotExist(state, groupPosition, newItem));
    dispatch({
      type: t.ADD_GROUP_ITEM,
      payload: {
        groupPosition: groupPosition,
        items: newItems
      }
    });
  };
}

function itemFromPath(path) {
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
