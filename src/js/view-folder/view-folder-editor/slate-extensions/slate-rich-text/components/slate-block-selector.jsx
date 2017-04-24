//@flow

import React from "react";
import Portal from "react-portal";
import { Motion, spring } from "react-motion";
import classnames from "classnames";
import Tooltip from "rc-tooltip";
import { BLOCK_TYPES } from "../../rich-text-types";

const TOOLBAR_WIDTH = 140;
const TOOLBAR_HEIGHT = 40;

type Props = {
  toggleBlock: (type: string, editor: any) => void,
  hasBlock: (type: string, editor: any) => boolean,
  getScrollContainer: () => Element,
  readOnly: boolean,
  block: any,
  editor: any
};

type State = {
  isOpen: boolean
};

export default class BlockSelector extends React.Component {
  props: Props;
  state: State;
  tooltipContent: any;
  blockStatus: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  togglePopover = () => {
    this.setState({
      isOpen: this.state.isOpen
    });
  };

  render() {
    const tooltipContent = (
      <div className="block-status__tooltip">
        {Object.keys(BLOCK_TYPES).map(key => {
          return this.renderToggleButton(BLOCK_TYPES[key], this.props.editor);
        })}
      </div>
    );

    return (
      <Tooltip
        placement="left"
        trigger={["click"]}
        key={this.props.block.key}
        transitionName="rc-tooltip-zoom"
        overlay={tooltipContent}
        getTooltipContainer={this.props.getScrollContainer}
      >
        <div
          contentEditable={false}
          className="block-status"
          style={{ userSelect: "none" }}
        >
          <div className="block-status__current">
            {BLOCK_TYPES[this.props.block.type].short}
          </div>
        </div>
      </Tooltip>
    );
  }

  renderToggleButton = (blockType: Object, editor: any) => {
    const { type, className } = blockType;

    const isActive = this.props.hasBlock(this.props.block, type);
    const onMouseDown = e => {
      // Prevent new selection in editor
      // Would close toolbar
      e.preventDefault();
      e.stopPropagation();
      this.props.toggleBlock(this.props.block, type, this.props.editor);
    };
    const classes = classnames({
      ["block-status__tooltip__button-" + className]: true,
      ["block-status__tooltip__button-" + className + "--active"]: isActive
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
