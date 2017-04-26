//@flow

import React from "react";
import Portal from "react-portal";
import { Motion, spring } from "react-motion";
import classnames from "classnames";
import HrefInput from "./slate-link-href-input";
import { MARK_TYPES, INLINE_TYPES } from "../../rich-text-types";

const TOOLBAR_WIDTH = 140;
const TOOLBAR_HEIGHT = 40;

type Props = {
  toggleMark: (type: string, editor: any) => void,
  hasMark: (type: string, editor: any) => boolean,
  isLink: (editor: any) => boolean,
  toggleLink: (editor: any) => void,
  setLinkHref: (url: string, editor: any) => void,
  getHrefFromSelectedInline: (editor: any) => string,
  editor: any
};

type State = {
  visible: boolean,
  freeze: boolean // Keep Position and force visibilty
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
      visible: false,
      freeze: false
    };
  }

  render() {
    const isLink = this.props.isLink(this.props.editor);

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
                className="menu hover-toolbar"
                style={{
                  display: this.state.visible ? "flex" : "none",
                  ...interpolatedPosition
                }}
              >
                {isLink
                  ? this.renderLinkEdit()
                  : [
                      this.renderMarkToggleButtons(),
                      this.renderLinkToggleButton()
                    ]}
              </div>
            );
          }}
        </Motion>
      </Portal>
    );
  }

  activateFreeze = () => {
    this.setState({
      freeze: true
    });
  };

  disableFreeze = () => {
    console.log("CLEAR");
    this.setState({
      freeze: false
    });
  };

  getToolbarStyle = () => {
    const { freeze } = this.state;
    const isVisible = this.shouldShowToolbar(this.props);
    const keepPosition = this.currentCoordinates;
    const show = { opacity: spring(1) };
    const hide = { opacity: spring(0) };

    if (freeze) {
      return { ...keepPosition, ...show };
    }

    if (!isVisible) {
      return { ...keepPosition, ...hide };
    }

    const selection = window.getSelection();
    if (selection.rangeCount == 0) {
      return { ...keepPosition, ...show };
    }
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const left =
      rect.left + window.scrollX - TOOLBAR_WIDTH / 2 + rect.width / 2;
    const top = rect.top + window.scrollY - TOOLBAR_HEIGHT;

    if (top < 0 || left < 0) {
      // position out of window
      return { ...keepPosition, ...hide };
    }

    // Save the new position for the next render
    this.currentCoordinates = { top, left };

    const shouldMoveAnimated =
      // Dont move in from the outside of the window
      keepPosition.top > 0 &&
      keepPosition.left > 0 &&
      // Dont move to far
      Math.abs(keepPosition.top - top) < 600 &&
      Math.abs(keepPosition.left - left) < 600;

    return {
      // Dont move from the outside of the window, looks anoying
      top: shouldMoveAnimated ? spring(top) : top,
      left: shouldMoveAnimated ? spring(left) : left,
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
    if (this.props.isLink(props.editor)) {
      return true;
    }
    if (state.isCollapsed) {
      return false;
    }
    if (window.getSelection().rangeCount < 1) {
      // Browser does not know the selection
      return false;
    }
    return true;
  };

  renderMarkToggleButtons = () => {
    const { editor, hasMark, toggleMark } = this.props;
    return Object.keys(MARK_TYPES).map(key => {
      const mark = MARK_TYPES[key];
      const isActive = hasMark(mark.type, editor);
      const onClick = () => {
        toggleMark(mark.type, editor);
      };
      return this.renderToggleButton(mark.className, isActive, onClick);
    });
  };

  renderToggleButton = (
    className: string,
    isActive: boolean,
    onClick: () => void
  ) => {
    const onMouseDown = e => {
      // Prevent new selection in editor
      // Would close toolbar
      e.preventDefault();
      e.stopPropagation();
      onClick();
    };
    const classes = classnames({
      ["hover-toolbar__button-" + className]: true,
      ["hover-toolbar__button-" + className + "--active"]: isActive
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

  renderLinkToggleButton = () => {
    const { editor, isLink, toggleLink } = this.props;
    const isActive = isLink(editor);
    const className = INLINE_TYPES.LINK.className;
    const onClick = () => {
      toggleLink(editor);
    };
    return this.renderToggleButton(className, isActive, onClick);
  };

  renderLinkEdit = () => {
    return (
      <div className="hover-toolbar__link-edit">
        <HrefInput
          href={this.props.getHrefFromSelectedInline(this.props.editor)}
          handleFocus={this.activateFreeze}
          handleBlur={this.disableFreeze}
          handleChange={(value: string) => {
            this.props.setLinkHref(value, this.props.editor);
          }}
        />
        {this.renderLinkToggleButton()}
      </div>
    );
  };
}
