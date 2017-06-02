//@flow

import * as c from "./navbar-constants";

export type itemDragData =
  | false
  | {
      itemId: string,
      groupId: number
    };

export type groupDragData =
  | false
  | {
      groupId: number
    };

export type ActionGroupItems = Array<GroupItem>;

export type GroupItem = {
  type: string,
  name: string,
  path: string
};
