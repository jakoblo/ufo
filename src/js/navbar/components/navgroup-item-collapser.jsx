//@flow
import React from "react";

const ITEM_HEIGHT = 28;
const ANIMATION_TIME = 350;

type Props = {
  children?: Element,
  itemCount: number,
  collapsed: boolean
};

type State = {
  height: number | string,
  animationInProgress: boolean
};

export default class NavGroupItemCollapser extends React.Component {
  state: State;
  props: Props;
  activeTimeout: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      height: this.props.collapsed ? 0 : this.props.itemCount * ITEM_HEIGHT,
      animationInProgress: false
    };
    this.activeTimeout = null;
  }

  render() {
    return (
      <div
        className="nav-bar-group__item-wrapper"
        style={{
          height: this.state.height,
          overflow: "hidden",
          transition: this.state.animationInProgress
            ? "height " + ANIMATION_TIME + "ms ease-out"
            : "none"
        }}
      >
        {this.props.children ? this.props.children : null}
      </div>
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.collapsed != nextProps.collapsed) {
      nextProps.collapsed ? this.collapse() : this.expand();
    }
  }

  collapse = () => {
    this.animate(this.props.itemCount * ITEM_HEIGHT, 0, 0);
  };

  expand = () => {
    this.animate(
      0,
      this.props.itemCount * ITEM_HEIGHT,
      this.props.itemCount * ITEM_HEIGHT
    );
  };

  animate = (
    startHeight: number,
    targetHeight: number,
    endHeight: number | string
  ) => {
    requestAnimationFrame(() => {
      this.setState({
        height: startHeight,
        animationInProgress: false
      });
      requestAnimationFrame(() => {
        this.setState({
          height: targetHeight,
          animationInProgress: true
        });
      });

      clearTimeout(this.activeTimeout);
      this.activeTimeout = setTimeout(
        () => {
          requestAnimationFrame(() => {
            this.setState({
              height: endHeight,
              animationInProgress: false
            });
          });
        },
        ANIMATION_TIME
      );
    });
  };
}
