"use strict"
import React from 'react'
import { connect } from 'react-redux'
import nodePath from 'path'
import classnames from 'classnames'
import NavGroupItem from './navgroup-item'
import NavGroupTitle from './navgroup-title'
import {remote} from 'electron'
import App from '../../app/app-index'
import * as Actions from '../navbar-actions'
import { DnDTypes } from '../navbar-constants'
import _ from 'lodash'
const {Menu, MenuItem} = remote
import { findDOMNode } from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import NavGroupItemCollapser from './navgroup-item-collapser'
import * as dragndrop from '../../utils/dragndrop'


export default class NavGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDragging: false,
      dragOver: false,
      draggingItem: false
    }
  }

  render() {
    const { dragOver, isDragging } = this.state;
    const dg = this.props.isDiskGroup
    let classname = classnames({
      'nav-bar-group': true,
      'nav-bar-group--collapsed': this.props.hidden,
      'nav-bar-group--is-dragging': (!dg && this.props.groupID == this.props.draggingGroup.id),
      'nav-bar-group--drop-target': dragOver,
    })

    return (
      <div 
        className={classname}
        draggable={true}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        data-key={this.props.index}
        {...this.dropZoneListener}
      >
        <NavGroupTitle 
          title={this.props.title}
          isDiskGroup={dg}
          hidden={this.props.hidden}
          onGroupTitleChange={!dg && this.handleGroupTitleChange}
          onGroupRemove={!dg && this.handleRemoveGroup}
          onToggleGroup={this.handleToggleGroup.bind(this, this.props.index)}
        />
        <NavGroupItemCollapser itemCount={this.props.items.length} collapsed={this.props.hidden} >
          <ReactCSSTransitionGroup
            transitionName="nav-bar-item--animation"
            transitionEnterTimeout={350}
            transitionLeaveTimeout={350}
          >
            {this.props.items.map(this.createGroupItem)}
          </ReactCSSTransitionGroup>
        </NavGroupItemCollapser>
      </div>
    )
  }

  // GROUP EVENTS

  handleToggleGroup = () => {
    this.props.dispatch(Actions.toggleGroup(this.props.index))
  }  

  handleRemoveGroup = () => {
    this.props.dispatch(Actions.removeNavGroup(this.props.index))
  }

  // GROUP TITLE EVENTS

  handleGroupTitleChange = (newTitle) => {
    this.props.dispatch(Actions.changeGroupTitle(this.props.index, newTitle))
  }

  /**
   * 
   * GROUP ITEM
   * 
   */
  createGroupItem = (item, index) => {
    const path = item.path
    let basePath = nodePath.basename(path)
    let active = (path === this.props.activeItem)
    let type = "folder"
    if(this.props.isDiskGroup)
    type = 'device'

    return (
      <NavGroupItem
        key={item.id}
        index={index}
        groupID={this.props.groupID}
        title={basePath}
        active={active}
        type={type}
        isDiskGroup={this.props.isDiskGroup}
        onClick={this.handleSelectionChanged.bind(this, path)}
        onItemRemove={this.handleOnItemRemove.bind(this, index)}
        onMoveGroupItem={this.handleMoveGroupItem}
        saveFavbar={this.handleSaveFavbar}
        draggingItem={this.state.draggingItem}
        setDraggingItem={this.setDraggingItem}
        clearDraggingItem={this.clearDraggingItem}
        >
      </NavGroupItem>)
  }

  // GROUP ITEM EVENTS

  handleOnItemRemove = (itemIndex, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.dispatch(Actions.removeGroupItem(this.props.groupID, itemIndex))
  }

  handleSelectionChanged = (path, e) => {
    if(e) {
      e.preventDefault()
      e.stopPropagation()
    }
    this.props.dispatch(App.actions.changeAppPath(path))
  }

  handleMoveGroupItem = (dragIndex, hoverIndex) => {
    this.props.dispatch(Actions.moveGroupItem(this.props.index, dragIndex, hoverIndex))
  }

  handleSaveFavbar = () => {
    this.props.dispatch(Actions.saveFavbartoStorage())
  }



  /**
   * Drag Listener
   * to Drag the Group arround the sort them in the other Group
   */

  onDragStart = (event) => {
    // Store ids of this Group, to access them in other Groups onDragOver
    const dragData = {
      id: this.props.groupID,
      index: this.props.index
    }
    setTimeout(() => {
      // Wait, to do not apply the dragging css to the dragging image
      this.props.setDraggingGroup(dragData)
    }, 1)
    event.dataTransfer.setData(
      DnDTypes.NAVGROUP,
      JSON.stringify(dragData)
    )
  }

  // Clear the stored
  onDragEnd = () => {
    this.props.clearDraggingGroup()
  }


  /**
   * Dropzone
   * the Navbar-Group can handle two type of Drops
   * the first is a file drop: The files will be added to to the Items of the Group
   * the second is a Navbar-Group Drag for sorting the Navbars.
   */

  dropZoneListener = dragndrop.getEnhancedDropZoneListener({
    acceptableTypes: [ DnDTypes.NAVGROUP, (!this.props.isDiskGroup) ? dragndrop.constants.TYPE_FILE : null],
    possibleEffects: dragndrop.constants.effects.ALL,

    dragHover: (event, cursorPosition) => {
      
      if(dragndrop.shouldAcceptDrop(event, dragndrop.constants.TYPE_FILE)) {
        
        // File DROP
        this.setState({
          dragOver: true
        })

      } else if (dragndrop.shouldAcceptDrop(event, DnDTypes.NAVGROUP)) {
        
        // Navgroup Drag

        if(!this.props.draggingGroup) {
          return // no needed data, jet
        }

        const dragIndex = this.props.draggingGroup.index
        const hoverIndex = this.props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return
        }

        if (dragIndex < hoverIndex && cursorPosition == dragndrop.constants.CURSOR_POSITION_TOP) {
          return // Not over 50% Group height downwards, do nothing for now
        }
        if (dragIndex > hoverIndex && cursorPosition == dragndrop.constants.CURSOR_POSITION_BOTTOM) {
          return // Not over 50% Group height upwards, do nothing for now
        }

        // Time to actually perform the action
        this.props.setDraggingGroup({
          id: this.props.draggingGroup.id, 
          index: hoverIndex
        })
        this.props.dispatch(Actions.moveNavGroup(dragIndex, hoverIndex))
      }
    },

    dragOut: () => {
      this.setState({
        dragOver: false
      })
    },

    drop: (event, cursorPosition) => {
      this.props.clearDraggingGroup()
        
      if(dragndrop.shouldAcceptDrop(event, dragndrop.constants.TYPE_FILE)) {
        
        // Filedrop, add File to Group
        if (this.props.isDiskGroup) return
        const fileList = dragndrop.getFilePathArray(event)
        if(fileList.length > 0) {
          this.props.dispatch(Actions.addGroupItems(this.props.groupID, fileList))
        }

      } else if (dragndrop.shouldAcceptDrop(event, DnDTypes.NAVGROUP)) {

        // Navgroup Drop Done, lets save that
        this.props.dispatch(Actions.saveFavbartoStorage())
      
      }
    }

  })

  setDraggingItem = (dragData) => {
    this.setState({
      draggingItem: dragData
    })
  }

  clearDraggingItem = () => {
    this.setState({
      draggingItem: false
    })
  }
}


