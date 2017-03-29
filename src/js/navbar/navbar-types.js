//@flow

import * as c from "./navbar-constants";

export type itemDragData =
  | false
  | {
      itemPosition: number,
      groupId: number
    };

export type groupDragData =
  | false
  | {
      groupPosition: number,
      groupId: number
    };

export type ActionGroupItems = Array<GroupItem>;

export type GroupItem = {
  type: string,
  name: string,
  path: string
};
