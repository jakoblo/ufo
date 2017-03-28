//@flow
import { Record, List } from "immutable";

export const NavGroupRecord = Record({
  id: null,
  title: "",
  diskGroup: false,
  items: List([]),
  itemsOrder: List([]),
  position: null,
  hidden: false
});

export const NavGroupItemRecord = Record({
  id: null,
  path: ""
});
