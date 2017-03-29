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

    case t.NAVBAR_GROUP_MOVE:
      if (action.payload.toPosition < 0) return state;

      const groupMoving = state.getIn(["groups", action.payload.fromPosition]);

      return state.set(
        "groups",
        state
          .get("groups")
          .delete(action.payload.fromPosition)
          .insert(action.payload.toPosition, groupMoving)
      );

    case t.NAVBAR_ITEM_MOVE:
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

    case t.NAVBAR_GROUP_TOGGLE:
      let hidden = state.getIn([
        "groups",
        action.payload.groupPosition,
        "hidden"
      ]);
      return state.setIn(
        ["groups", action.payload.groupPosition, "hidden"],
        !hidden
      );

    case t.NAVBAR_GROUP_CREATE:
      const pl = action.payload;

      const groups = state.get("groups");
      const id = pl.diskGroup ? c.DISKS_GROUP_ID : "id_" + new Date().getTime();
      const position = pl.position ? pl.position : groups.size;

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

    case t.NAVBAR_ITEMS_CREATE:
      let newItems = state
        .getIn(["groups", action.payload.groupPosition, "items"])
        .push(...action.payload.items.map(item => new NavGroupItem(item)));
      return state.setIn(
        ["groups", action.payload.groupPosition, "items"],
        newItems
      );

    case t.NAVBAR_ITEMS_SET:
      return state.setIn(
        ["groups", action.payload.groupPosition, "items"],
        List(action.payload.items.map(item => new NavGroupItem(item)))
      );

    case t.NAVBAR_ITEM_REMOVE:
      return state.deleteIn([
        "groups",
        action.payload.groupPosition,
        "items",
        action.payload.itemPosition
      ]);

    case t.NAVBAR_GROUP_TITLE_CHANGE:
      return state.setIn(
        ["groups", action.payload.groupPosition, "title"],
        action.payload.newTitle
      );

    case t.NAVBAR_GROUP_REMOVE:
      return state.deleteIn(["groups", action.payload.groupPosition]);

    default:
      return state;
  }
}
