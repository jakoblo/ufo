//@flow
import * as t from "./navbar-actiontypes";
import * as c from "./navbar-constants";
import App from "../app/app-index";
import { Map, List, fromJS } from "immutable";
import * as Model from "./navbar-models";

const INITIAL_STATE = Map({
  groups: Map({}),
  groupsOrder: List([]),
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
      const groupId = state.getIn(["groupsOrder", action.payload.dragPosition]);

      return state.set(
        "groupsOrder",
        state
          .get("groupsOrder")
          .delete(action.payload.dragPosition)
          .insert(action.payload.hoverPosition, groupId)
      );

    case t.MOVE_GROUPITEM:
      if (action.payload.overPosition < 0) return state;
      let itemsOrder = state.getIn([
        "groups",
        action.payload.groupId,
        "itemsOrder"
      ]);

      let itemId = itemsOrder.get(action.payload.dragOriginPosition);

      itemsOrder = itemsOrder
        .delete(action.payload.dragOriginPosition)
        .insert(action.payload.overPosition, itemId);

      return state.setIn(
        ["groups", action.payload.groupId, "itemsOrder"],
        itemsOrder
      );

    case t.NAVBAR_LOAD_FROM_STORAGE:
      let newGroups = Map({});

      Object.keys(action.payload.groups).forEach(id => {
        const group = action.payload.groups[id];
        newGroups.set(
          id,
          Model.NavGroupRecord({
            id: id,
            title: group.title,
            type: group.type,
            diskGroup: group.diskGroup,
            hidden: group.hidden,
            items: List(group.items),
            itemsOrder: List(group.itemsOrder)
          })
        );
      });

      return state
        .set("groups", newGroups)
        .set("groupsOrder", fromJS(action.payload.groupsOrder));

    case t.NAVBAR_TOGGLE_GROUP:
      let hidden = state.getIn(["groups", action.payload.groupId, "hidden"]);
      return state.setIn(["groups", action.payload.groupId, "hidden"], !hidden);

    case t.ADD_NAVGROUP:
      const pl = action.payload;

      const groups = state.get("groups");
      const groupsOrder = state.get("groupsOrder");
      const id = pl.diskGroup ? c.DISKS_GROUP_ID : "id_" + new Date().getTime();
      const position = pl.position ? pl.position : groupsOrder.size;

      let order;
      if (pl.items.length == pl.itemsOrder.length) {
        order = pl.itemsOrder;
      } else {
        order = pl.items.map((path, index) => index);
      }

      return state
        .set(
          "groups",
          groups.set(
            id,
            Model.NavGroupRecord({
              id: id,
              title: pl.title,
              type: pl.type,
              diskGroup: pl.diskGroup,
              hidden: pl.hidden,
              items: List(pl.items),
              itemsOrder: List(order)
            })
          )
        )
        .set("groupsOrder", groupsOrder.insert(position, id));

    case t.ADD_GROUP_ITEM:
      let addIndex = state
        .get("groups")
        .findIndex(group => group.get("id") === action.payload.groupId);
      let newItems = state
        .getIn(["groups", addIndex, "items"])
        .push(...action.payload.items);
      return state.setIn(["groups", addIndex, "items"], newItems);

    case t.NAVBAR_REMOVE_GROUP_ITEM:
      let rmIndex = state
        .get("groups")
        .findIndex(group => group.get("id") === action.payload.groupId);
      return state.deleteIn([
        "groups",
        rmIndex,
        "items",
        action.payload.itemID
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
        ["groups", action.payload.groupId, "title"],
        action.payload.newTitle
      );

    case t.REMOVE_NAVGROUP:
      const groupPosition = state
        .get("groupsOrder")
        .indexOf(action.payload.groupId);

      return state
        .deleteIn(["groups", action.payload.groupId])
        .deleteIn(["groupsOrder", groupPosition]);

    default:
      return state;
  }
}
