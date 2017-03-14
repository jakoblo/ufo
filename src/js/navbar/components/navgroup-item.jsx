"use strict"
import React from 'react'
import classnames from 'classnames'
import Icon from '../../general-components/icon'
import Button from '../../general-components/button'
import { findDOMNode } from 'react-dom'
import { DnDTypes } from '../navbar-constants'
import * as dragndrop from '../../utils/dragndrop'

export default class NavGroupItem extends React.Component {
  constructor(props) {
    super(props)
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
        onClick={this.props.onClick} 
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
    setTimeout(() => {
      // Wait, to do not apply the dragging css to the dragging image
      this.props.setDraggingItem(dragData)
    }, 1)
    event.dataTransfer.setData( DnDTypes.GROUPITEM, JSON.stringify(dragData) )
  }

  // Clear the stored dragging item
  onDragEnd = () => {
    this.props.clearDraggingItem()
  }

  /**
   * Dropzone
   * 
   */

  dropZoneListener = dragndrop.getEnhancedDropZoneListener({
    acceptableTypes: [DnDTypes.GROUPITEM, dragndrop.constants.TYPE_FILE],
    possibleEffects: dragndrop.constants.effects.ALL,

    dragHover: (event, cursorPosition) => {
      if(dragndrop.shouldAcceptDrop(event, DnDTypes.GROUPITEM )) {
        this.itemDragOverToSort(event, cursorPosition)
      } 
      if(dragndrop.shouldAcceptDrop(event, dragndrop.constants.TYPE_FILE )) {
        this.fileDragOver(event, cursorPosition)
      }
    },

    dragOut: (event) => {
      this.fileDragOut()
    },

    drop: (event, cursorPosition) => {
      this.props.clearDraggingItem()
      this.props.saveFavbar()
    }

  })

  itemDragOverToSort = (event, cursorPosition) => {
    if(!this.props.draggingItem) return // no needed data, jet
    if(this.props.groupID !== this.props.draggingItem.groupID) return

    const dragIndex = this.props.draggingItem.index
    const hoverIndex = this.props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) return

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
  }

  fileDragOver = (event, cursorPosition) => {
    this.startPeakTimeout()
    this.setState({
      dropTarget: true
    })
  }

  fileDragOut = (event) => {
    this.cancelPeakTimeout()
    this.setState({
      dropTarget: false
    })
  }

  dragOverTimeout = null

  startPeakTimeout = () => {
    if(
      (this.props.type == "folder" || this.props.type == "device") && 
      this.dragOverTimeout == null
    ) {
      this.dragOverTimeout = setTimeout(() => {
        console.log('click', this.props.onClick)
        this.props.onClick()
      }, 1000)
    }
  }

  cancelPeakTimeout = () => {
    clearTimeout(this.dragOverTimeout)
    this.dragOverTimeout = null
  }

}
