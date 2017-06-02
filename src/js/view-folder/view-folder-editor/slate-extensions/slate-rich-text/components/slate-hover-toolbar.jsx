//@flow

import React from "react";
import Portal from "react-portal";
import { Motion, spring } from "react-motion";
import classnames from "classnames";
import HrefInput from "./slate-link-href-input";
import { shell } from "electron";
import normalizeUrl from "normalize-url";

import { MARK_TYPES, INLINE_TYPES } from "../../rich-text-types";

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
  menu: any;
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
      <div
        className="rc-tooltip rc-tooltip-placement-top slate-marks-toolbar"
        ref={ref => {
          this.menu = ref;
        }}
      >
        <div className="rc-tooltip-inner">
          {isLink
            ? this.renderLinkEdit()
            : [this.renderMarkToggleButtons(), this.renderLinkToggleButton()]}
        </div>
      </div>
    );
  }

  componentDidMount = () => {
    this.updateMenu();
  };

  componentDidUpdate = () => {
    this.updateMenu();
  };

  updateMenu = () => {
    const { menu } = this;
    const { freeze } = this.state;
    const { editor, isLink } = this.props;
    const state: any = this.props.editor.getState();

    if (!menu) return;

    if (this.state.freeze) {
      menu.style.opacity = 1;
      menu.style.top = this.currentCoordinates.top + "px";
      menu.style.left = this.currentCoordinates.left + "px";
      return;
    }

    if (state.isBlurred || (state.isCollapsed && !isLink(editor))) {
      menu.removeAttribute("style");
      menu.style.opacity = 0;
      return;
    }

    const selection = window.getSelection();

    if (selection.rangeCount < 1) {
      menu.removeAttribute("style");
      menu.style.opacity = 0;
      return;
    }

    const range = selection.getRangeAt(0);
    const selectionRect = range.getBoundingClientRect();
    const container = range.commonAncestorContainer.parentNode.closest(
      ".view-folder__editor-container" // @TODO
    );
    const containerRect = container.getBoundingClientRect();

    const top = selectionRect.top - containerRect.top - menu.offsetHeight - 5;
    const left =
      selectionRect.left -
      containerRect.left -
      menu.offsetWidth / 2 +
      selectionRect.width / 2;

    this.currentCoordinates.top = top;
    this.currentCoordinates.left = left;

    menu.style.opacity = 1;
    menu.style.top = top + "px";
    menu.style.left = left + "px";
  };

  activateFreeze = () => {
    this.setState({
      freeze: true
    });
  };

  disableFreeze = () => {
    this.setState({
      freeze: false
    });
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
      ["slate-marks-toolbar__button-" + className]: true,
      ["slate-marks-toolbar__button-" + className + "--active"]: isActive
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
      <div className="slate-marks-toolbar__link-edit">
        <HrefInput
          href={this.props.getHrefFromSelectedInline(this.props.editor)}
          handleFocus={this.activateFreeze}
          handleBlur={this.disableFreeze}
          handleChange={(value: string) => {
            this.props.setLinkHref(value, this.props.editor);
          }}
        />
        {this.renderToggleButton("open-link", false, () => {
          let href = null;
          try {
            href = normalizeUrl(
              this.props.getHrefFromSelectedInline(this.props.editor)
            );
          } catch (e) {
            href = null;
          }

          if (href) {
            shell.openExternal(href);
          }
        })}
        {this.renderToggleButton("remove", false, () => {
          this.props.toggleLink(this.props.editor);
        })}
      </div>
    );
  };
}
