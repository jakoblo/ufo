"use strict"
import React from 'react'
import classnames from 'classnames'
import Icon from '../../general-components/icon'
import Button from '../../general-components/button'
import { findDOMNode } from 'react-dom'
import { DnDTypes } from '../navbar-constants'
import * as dragndrop from '../../utils/dragndrop'

// const itemSource = {
//   canDrag(props, monitor) {
//     return !props.isDiskGroup
//   },
//   beginDrag(props) {
//     return {
//       id: props.index,
//       index: props.index,
//       groupID: props.groupID
//     };
//   }
// }

// const itemTarget = { 
//   // Sort Navgroups by drag and drop
//   drop(props, monitor, component) {
//     if(monitor.getItemType() === DnDTypes.GROUPITEM) {
//       props.saveFavbar()
//     }
//   },
//   hover(props, monitor, component) {
//     if(monitor.getItemType() !== DnDTypes.GROUPITEM) return
//     if(props.groupID !== monitor.getItem().groupID) return

//     const dragIndex = monitor.getItem().index;
//     const hoverIndex = props.index;

//     // Don't replace items with themselves
//     if (dragIndex === hoverIndex) {
//       return;
//     }

//     // Determine rectangle on screen
//     const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

//     // Get vertical middle
//     const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

//     // Determine mouse position
//     const clientOffset = monitor.getClientOffset();

//     // Get pixels to the top
//     const hoverClientY = clientOffset.y - hoverBoundingRect.top;

//     // Only perform the move when the mouse has crossed half of the items height
//     // When dragging downwards, only move when the cursor is below 50%
//     // When dragging upwards, only move when the cursor is above 50%

//     // Dragging downwards
//     if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
//       return;
//     }

//     // Dragging upwards
//     if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
//       return;
//     }

//     // Time to actually perform the action
//     //props.moveCard(dragIndex, hoverIndex);
//     props.onMoveGroupItem(dragIndex, hoverIndex)

//     // Note: we're mutating the monitor item here!
//     // Generally it's better to avoid mutations,
//     // but it's good here for the sake of performance
//     // to avoid expensive index searches.
//     monitor.getItem().index = hoverIndex;
//   }
// }

// @DropTarget([DnDTypes.GROUPITEM, NativeTypes.FILE], itemTarget, (connect, monitor) => ({
//   connectDropTarget: connect.dropTarget(),
//   isOver: monitor.isOver() && (monitor.getItemType() === NativeTypes.FILE),
//   isOverCurrent: monitor.isOver({ shallow: true }) && (monitor.getItemType() === NativeTypes.FILE),
// }))
// @DragSource(DnDTypes.GROUPITEM, itemSource, (connect, monitor) => ({
//   connectDragSource: connect.dragSource(),
//   isDragging: monitor.isDragging(),
// }))
export default class NavGroupItem extends React.Component {
  constructor(props) {
    super(props)
    this.dragOverTimeout = null
    this.state = {
      dropTarget: false
    }
  }

 render() {

    const className = classnames(
      this.props.className,
      'nav-bar-item--theme-'+this.props.type, 
      {
        "nav-bar-item": true,
        "nav-bar-item--active": this.props.active,
        "nav-bar-item--is-dragging": (this.props.draggingItem.index == this.props.index),
        "nav-bar-item--drop-target": this.state.dropTarget
      })
    const deleteButton = <Button className="nav-bar-item__button-remove" onClick={this.props.onItemRemove} />

    return (
      <div 
        className={className} 
        draggable={true} 
        onDragStart={this.onDragStart} 
        onDragEnd={this.onDragEnd} 
        {...this.dropZoneListener}
      >
        <div className="nav-bar-item__underlay" />
        <span className="nav-bar-item__text">
          {this.props.title}
        </span>
        {!this.props.isDiskGroup && deleteButton}
      </div>
    )
  }

  componentWillReceiveProps = (nextProps) => {
    if (!this.props.isOver && nextProps.isOver) {
      // You can use this as enter handler
      this.dragOverTimeout = setTimeout(this.props.onClick, 1000)
      this.setState({
        dropTarget: true
      })
    }
    if (this.props.isOver && !nextProps.isOver) {
      // You can use this as leave handler
      clearTimeout(this.dragOverTimeout)
      this.setState({
        dropTarget: false
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // immutable?
    return(
      this.state.dropTarget != nextState.dropTarget ||
      this.props.active != nextProps.active ||
      this.props.groupID != nextProps.groupID ||
      this.props.draggingItem != nextProps.draggingItem ||
      this.props.index != nextProps.index ||
      this.props.isDragging != nextProps.isDragging ||
      this.props.isOver != nextProps.isOver ||
      this.props.isOverCurrent != nextProps.isOverCurrent ||
      this.props.title != nextProps.title
    )
  }


  /**
   * Drag Listener
   * to Drag the Group arround the sort them in the other Group
   */

  onDragStart = (event) => {
    // Store ids of this Group, to access them in other Groups onDragOver
    event.stopPropagation()
    const dragData = {
      index: this.props.index,
      groupID: this.props.groupID
    }
    this.props.setDraggingItem(dragData)
    event.dataTransfer.setData( DnDTypes.GROUPITEM, JSON.stringify(dragData) )
  }

  // Clear the stored
  onDragEnd = () => {
    this.props.clearDraggingItem()
  }

  /**
   * Dropzone
   * 
   */

  dropZoneListener = dragndrop.getEnhancedDropZoneListener({
    acceptableTypes: DnDTypes.GROUPITEM,
    possibleEffects: dragndrop.constants.effects.ALL,

    dragHover: (event, cursorPosition) => {
      if(this.props.groupID !== this.props.draggingItem.groupID) return
    
      const dragIndex = this.props.draggingItem.index
      const hoverIndex = this.props.index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      if (dragIndex+1 == hoverIndex && cursorPosition == dragndrop.constants.CURSOR_POSITION_TOP) {
        return // Not over 50% Group height downwards, do nothing for now
      }
      if (dragIndex-1 == hoverIndex && cursorPosition == dragndrop.constants.CURSOR_POSITION_BOTTOM) {
        return // Not over 50% Group height upwards, do nothing for now
      }

      // Time to actually perform the action
      this.props.setDraggingItem({
        index: hoverIndex,
        groupID: this.props.groupID
      })
      this.props.onMoveGroupItem(dragIndex, hoverIndex)

    },

    dragOut: () => {
      this.setState({
        dragOver: false
      })
    },

    drop: (event, cursorPosition) => {
      this.props.clearDraggingItem()
      this.props.saveFavbar()
    }

  })


}
