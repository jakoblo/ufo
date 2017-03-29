//@flow
import React from "react";
import { Motion, spring } from "react-motion";
import * as c from "../navbar-constants";

type Props = {
  children?: Element,
  itemCount: number,
  collapsed: boolean
};

export default class NavGroupItemCollapser extends React.Component {
  props: Props;
  defaultHeight: any;
  constructor(props: Props) {
    super(props);
    this.defaultHeight = this.calcHeight(props);
  }

  render() {
    return (
      <Motion
        defaultStyle={{ height: this.defaultHeight }}
        style={{ height: spring(this.calcHeight(this.props)) }}
      >
        {value => (
          <div
            className="nav-bar-group__item-wrapper"
            style={{
              height: value.height,
              overflow: "hidden"
            }}
          >
            {this.props.children ? this.props.children : null}
          </div>
        )}
      </Motion>
    );
  }

  calcHeight(props: Props) {
    return props.collapsed ? 0 : props.itemCount * c.ITEM_HEIGHT;
  }
}
