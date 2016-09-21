"use strict"
import React from 'react'
import classnames from 'classnames'
import Icon from '../../general-components/icon'
import Button from '../../general-components/button'
import { DropTarget, DragSource } from 'react-dnd'
import { findDOMNode } from 'react-dom'
import { NativeTypes } from 'react-dnd-html5-backend'
import { DnDTypes } from '../navbar-constants'

const itemSource = {
  canDrag(props, monitor) {
    return !props.isDiskGroup
  },
  beginDrag(props) {
    return {
      id: props.index,
      index: props.index
    };
  }
}

const itemTarget = {
  drop(props, monitor, component) {
    if(monitor.getItemType() === DnDTypes.GROUPITEM) {
      props.saveFavbar()
    }
  },
  hover(props, monitor, component) {
    if(monitor.getItemType() !== DnDTypes.GROUPITEM) return

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
  

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    //props.moveCard(dragIndex, hoverIndex);
    props.onMoveGroupItem(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
}

@DropTarget([DnDTypes.GROUPITEM, NativeTypes.FILE], itemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver() && (monitor.getItemType() === NativeTypes.FILE),
  isOverCurrent: monitor.isOver({ shallow: true })
}))
@DragSource(DnDTypes.GROUPITEM, itemSource, (connect, monitor) => ({
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDragSource: connect.dragSource(),
  // You can ask the monitor about the current drag state:
  isDragging: monitor.isDragging(),
}))
export default class NavGroupItem extends React.Component {
  constructor(props) {
    super(props)
  }

 render() {
    // let icon = this.getIconComponent()
    const { isOver, isDragging, connectDragSource, connectDropTarget } = this.props;
    let className = classnames(this.props.className, "nav-group-item", {"active": this.props.active})
    let deleteButton = <Button className="remove" onClick={this.props.onItemRemove}></Button>
    const dndStyle = { opacity: isDragging ? 0 : 1 }

    return connectDragSource(connectDropTarget(
      <a onClick={this.props.onClick} style={dndStyle} className={className}>
        <Icon glyph={this.props.glyph} />
        <span className="text">{this.props.title}</span>
        {!this.props.isDiskGroup && deleteButton}
      </a>
    ))
  }
}
