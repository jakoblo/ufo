//@flow
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
