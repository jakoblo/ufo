//@flow
import * as t from "./navbar-actiontypes";
import * as c from "./navbar-constants";
import App from "../app/app-index";
import { Map, List, fromJS } from "immutable";
import { NavGroup, NavGroupItem } from "./navbar-models";

const INITIAL_STATE = Map({
  groups: List([]),
  activeItem: ""
});

import type { Action } from "../types";

export default function navbarReducer(
  state: any = INITIAL_STATE,
  action: Action = { type: "", payload: {} }
) {
  switch (action.type) {
    case App.actiontypes.APP_CHANGE_PATH:
      return state.set("activeItem", action.payload.pathRoute[0]);

    case t.MOVE_NAVGROUP:
      if (action.payload.hoverPosition < 0) return state;

      const draggingGroup = state.getIn([
        "groups",
        action.payload.dragPosition
      ]);

      return state.set(
        "groups",
        state
          .get("groups")
          .delete(action.payload.dragPosition)
          .insert(action.payload.hoverPosition, draggingGroup)
      );

    case t.MOVE_GROUPITEM:
      if (action.payload.itemToPosition < 0) return state;
      let items = state.getIn([
        "groups",
        action.payload.groupPosition,
        "items"
      ]);

      let item = items.get(action.payload.itemFromPosition);

      items = items
        .delete(action.payload.itemFromPosition)
        .insert(action.payload.itemToPosition, item);

      return state.setIn(
        ["groups", action.payload.groupPosition, "items"],
        items
      );

    case t.NAVBAR_LOAD_FROM_STORAGE:
      return state.set(
        "groups",
        List(
          action.payload.groups.map(group => {
            return new NavGroup({
              id: group.id,
              title: group.title,
              type: group.type,
              hidden: group.hidden,
              items: List(group.items.map(item => new NavGroupItem(item)))
            });
          })
        )
      );

    case t.NAVBAR_TOGGLE_GROUP:
      let hidden = state.getIn([
        "groups",
        action.payload.groupPosition,
        "hidden"
      ]);
      return state.setIn(
        ["groups", action.payload.groupPosition, "hidden"],
        !hidden
      );

    case t.ADD_NAVGROUP:
      const pl = action.payload;

      const groups = state.get("groups");
      const id = pl.diskGroup ? c.DISKS_GROUP_ID : "id_" + new Date().getTime();
      const position = pl.position ? pl.position : groups.size;

      console.log(action);

      return state.set(
        "groups",
        groups.set(
          position,
          new NavGroup({
            id: id,
            title: pl.title,
            hidden: pl.hidden,
            items: List(pl.items.map(item => new NavGroupItem(item)))
          })
        )
      );

    case t.ADD_GROUP_ITEM:
      let newItems = state
        .getIn(["groups", action.payload.groupPosition, "items"])
        .push(...action.payload.items.map(item => new NavGroupItem(item)));
      return state.setIn(
        ["groups", action.payload.groupPosition, "items"],
        newItems
      );

    case t.NAVBAR_REMOVE_GROUP_ITEM:
      return state.deleteIn([
        "groups",
        action.payload.groupPosition,
        "items",
        action.payload.itemPosition
      ]);

    case t.REMOVE_DISKGROUP_ITEM:
      const deviceGroupIndex = state
        .get("groups")
        .findIndex(group => group.get("id") === 0);
      const deviceGroupItem = state
        .getIn(["groups", deviceGroupIndex, "items"])
        .findIndex(item => item.get("path") === action.payload.fileObj.path);
      return state.deleteIn([
        "groups",
        deviceGroupIndex,
        "items",
        deviceGroupItem
      ]);

    case t.NAVBAR_CHANGE_GROUP_TITLE:
      return state.setIn(
        ["groups", action.payload.groupPosition, "title"],
        action.payload.newTitle
      );

    case t.REMOVE_NAVGROUP:
      return state.deleteIn(["groups", action.payload.groupPosition]);

    default:
      return state;
  }
}
