//@flow
import React from "react";
import classnames from "classnames";
import Icon from "../../general-components/icon";
import Button from "../../general-components/button";
import { findDOMNode } from "react-dom";
import { DnDTypes } from "../navbar-constants";
import * as dragndrop from "../../utils/dragndrop";
import * as types from "../navbar-types";
import * as c from "../navbar-constants";

type Props = {
  active: boolean, // Selected or open
  draggingItem: types.itemDragData,
  item: any,
  position: number,
  groupId: number,
  style: Object,
  onClick: Function,
  onItemRemove: Function,
  setDraggingItem: (types.itemDragData) => void,
  clearDraggingItem: Function,
  onMoveGroupItem: Function
};

type State = {
  dropTarget: boolean
};

export default class NavGroupItem extends React.Component {
  props: Props;
  state: State;
  startTopOffset: number;
  inTransition: boolean; // Avoid dragOver handling in transations
  constructor(props: Props) {
    super(props);
    this.inTransition = false;
    this.state = {
      dropTarget: false
    };
  }

  render() {
    const className = classnames(
      "nav-bar-item",
      "nav-bar-item--theme-" + this.props.item.type,
      {
        "nav-bar-item": true,
        "nav-bar-item--active": this.props.active,
        "nav-bar-item--is-dragging": this.props.draggingItem &&
          this.props.draggingItem.itemPosition === this.props.position,
        "nav-bar-item--drop-target": this.state.dropTarget
      }
    );

    return (
      <div
        className={className}
        onClick={this.props.onClick}
        draggable={true}
        style={this.props.style}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        {...this.dropZoneListener}
      >
        <div className="nav-bar-item__underlay" />
        <span className="nav-bar-item__text">
          {this.props.item.name}
        </span>
        {!this.props.isDiskGroup
          ? <Button
              className="nav-bar-item__button-remove"
              onClick={this.props.onItemRemove}
            />
          : null}
      </div>
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.position != nextProps.position) {
      // Avoid dragOver handling in transations
      this.inTransition = true;

      setTimeout(
        () => {
          this.inTransition = false;
        },
        c.ANIMATION_TIME
      );
    }
  }

  /**
   * Drag Listener
   * to Drag the Group arround the sort them in the other Group
   */

  onDragStart = (event: SyntheticDragEvent) => {
    event.stopPropagation(); //Avoid dragStart on nav-group

    // Store dragData this Group, to access them in other Groups onDragOver
    const dragData: types.itemDragData = {
      itemPosition: this.props.position,
      groupId: this.props.groupId
    };

    // We use the DataType of the event, but we cant access the data in dragOver.. useless
    event.dataTransfer.setData(DnDTypes.GROUPITEM, "uselesData");
    setTimeout(
      () => {
        // Wait, to do not apply the dragging css to the dragging image
        this.props.setDraggingItem(dragData);
      },
      1
    );
  };

  // Clear the stored dragging item
  onDragEnd = () => {
    this.props.clearDraggingItem();
  };

  /**
   * Dropzone
   *
   */

  dropZoneListener = dragndrop.getEnhancedDropZoneListener({
    acceptableTypes: [DnDTypes.GROUPITEM, dragndrop.constants.TYPE_FILE],
    possibleEffects: dragndrop.constants.effects.ALL,

    dragHover: (event, cursorPosition) => {
      if (dragndrop.shouldAcceptDrop(event, DnDTypes.GROUPITEM)) {
        event.preventDefault(); // Drop is valid, will avoid cancel animation onDrop
        this.itemDragOverToSort(event, cursorPosition);
      } else if (
        dragndrop.shouldAcceptDrop(event, dragndrop.constants.TYPE_FILE)
      ) {
        // Drop is not valid, no preventDefault
        this.fileDragOver(event, cursorPosition);
      }
    },

    dragOut: (event: SyntheticDragEvent) => {
      this.cancelPeakTimeout();
      this.setState({
        dropTarget: false
      });
    },

    drop: (event, cursorPosition) => {
      if (dragndrop.shouldAcceptDrop(event, DnDTypes.GROUPITEM)) {
        event.preventDefault();
        event.stopPropagation();
        this.props.clearDraggingItem();
      }
    }
  });

  itemDragOverToSort = (event: SyntheticDragEvent, cursorPosition: string) => {
    if (this.props.draggingItem === false) return; // no needed data, jet
    if (this.props.groupId !== this.props.draggingItem.groupId) return; // dragging only navgroup internal
    if (this.inTransition) return; // Transtion in progess, stop event handling will avoid bouncing

    const dragginOriginPosition = this.props.draggingItem.itemPosition;
    const overPosition = this.props.position;

    // Don't replace items with themselves
    if (dragginOriginPosition === overPosition) return;

    // Time to actually perform the action
    // Set dragging item to new position
    this.props.setDraggingItem({
      itemPosition: overPosition,
      groupId: this.props.groupId
    });
    // Move the item in the redux store
    this.props.onMoveGroupItem(dragginOriginPosition, overPosition);
  };

  fileDragOver = (event: SyntheticDragEvent, cursorPosition: string) => {
    this.startPeakTimeout();
    this.setState({
      dropTarget: true
    });
  };

  dragOverTimeout = null;

  startPeakTimeout = () => {
    if (
      (this.props.type == "folder" || this.props.type == "device") &&
      this.dragOverTimeout == null
    ) {
      this.dragOverTimeout = setTimeout(
        () => {
          console.log("click", this.props.onClick);
          this.props.onClick();
        },
        1000
      );
    }
  };

  cancelPeakTimeout = () => {
    clearTimeout(this.dragOverTimeout);
    this.dragOverTimeout = null;
  };
}
