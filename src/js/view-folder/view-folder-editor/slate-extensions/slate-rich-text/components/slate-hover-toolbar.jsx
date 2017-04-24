//@flow

import React from "react";
import Portal from "react-portal";
import { Motion, spring } from "react-motion";
import classnames from "classnames";
import { MARK_TYPES } from "../../rich-text-types";

const TOOLBAR_WIDTH = 140;
const TOOLBAR_HEIGHT = 40;

type Props = {
  toggleMark: (type: string, editor: any) => void,
  hasMark: (type: string, editor: any) => boolean,
  editor: any
};

type State = {
  visible: boolean
};

export default class HoverToolbar extends React.Component {
  props: Props;
  state: State;
  currentCoordinates: {
    left: number,
    top: number
  };
  constructor(props: Props) {
    super(props);
    this.currentCoordinates = {
      top: 0,
      left: 0
    };
    this.state = {
      visible: false
    };
  }

  render() {
    return (
      <Portal isOpened>
        <Motion
          defaultStyle={{
            left: this.currentCoordinates.left,
            top: this.currentCoordinates.top,
            opacity: 0
          }}
          style={this.getToolbarStyle()}
          onRest={() => {
            if (!this.shouldShowToolbar(this.props)) {
              // Unclickable after fadeout
              this.setState({
                visible: false
              });
            }
          }}
        >
          {interpolatedPosition => {
            return (
              <div
                className="menu hover-menu"
                style={{
                  display: this.state.visible ? "flex" : "none",
                  ...interpolatedPosition
                }}
              >
                {Object.keys(MARK_TYPES).map(key => {
                  return this.renderToggleButton(
                    MARK_TYPES[key],
                    this.props.editor
                  );
                })}
              </div>
            );
          }}
        </Motion>
      </Portal>
    );
  }

  getToolbarStyle = () => {
    const visible = this.shouldShowToolbar(this.props);
    const currentCoordinates = this.currentCoordinates;

    if (!visible) {
      // Keep current position and fade out
      return {
        top: this.currentCoordinates.top,
        left: this.currentCoordinates.left,
        opacity: spring(0)
      };
    }

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const left = rect.left +
      window.scrollX -
      TOOLBAR_WIDTH / 2 +
      rect.width / 2;
    const top = rect.top + window.scrollY - TOOLBAR_HEIGHT;

    if (top < 0 || left < 0) {
      // out of screen
      // Keep current position and fade out
      return {
        top: this.currentCoordinates.top,
        left: this.currentCoordinates.left,
        opacity: spring(0)
      };
    }

    this.currentCoordinates = { top, left };

    return {
      // Dont move in from 0, looks anoying
      top: currentCoordinates.top > 0 ? spring(top) : top,
      left: currentCoordinates.left > 0 ? spring(left) : left,
      opacity: spring(1)
    };
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.shouldShowToolbar(nextProps)) {
      this.setState({
        visible: true
      });
    }
  }

  shouldShowToolbar = (props: Props) => {
    const state: any = props.editor.getState();
    if (state.isBlurred || state.isCollapsed) {
      return false;
    }
    if (window.getSelection().rangeCount < 1) {
      // Browser does not know the selection
      return false;
    }
    return true;
  };

  renderToggleButton = (mark: any, editor: any) => {
    const isActive = this.props.hasMark(mark.type, editor);
    const onMouseDown = e => {
      // Prevent new selection in editor
      // Would close toolbar
      e.preventDefault();
      e.stopPropagation();
      this.props.toggleMark(mark.type, this.props.editor);
    };
    const classes = classnames({
      ["hover-menu__button-" + mark.className]: true,
      ["hover-menu__button-" + mark.className + "--active"]: isActive
    });

    return (
      <span
        className={classes}
        onMouseUp={onMouseDown}
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onFocus={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        data-active={isActive}
      />
    );
  };
}
