//@flow
import { Record, List } from "immutable";
import * as c from "./navbar-constants";

export class NavGroup
  extends Record({
    id: null,
    title: "",
    items: List([]),
    hidden: false
  }) {
  get diskGroup(): boolean {
    return this.id === c.DISKS_GROUP_ID;
  }
}

export class NavGroupItem
  extends Record({
    type: null,
    name: null,
    path: ""
  }) {}
