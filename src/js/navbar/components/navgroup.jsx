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
import { DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom';

const groupTarget = {
  hover(props, monitor, component) {
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
    //props.dispatch(Actions.moveNavGroup(dragIndex, hoverIndex))

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
}

@DropTarget([DnDTypes.NAVGROUP], groupTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
export default class NavGroup extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const dg = this.props.isDiskGroup
    const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;

    let hideButtonText = this.props.hidden ? "show" : "hide";
    let classname = classnames({
      'nav-group': true,
      'hide': this.props.hidden
    })

    return connectDropTarget(
      <div className={classname} style={{opacity}} onDrop={this.handleDrop.bind(this)} onDragOver={this.handleDragOver}>
        <NavGroupTitle 
          title={this.props.title}
          isDiskGroup={dg}
          groupID={this.props.groupID} 
          onGroupTitleChange={!dg && this.handleGroupTitleChange} 
          hideButtonText={hideButtonText} 
          onToggleGroup={this.handleToggleGroup.bind(this, this.props.groupID)}
          onContextMenu={!dg && this.onContextMenu}
        />
        <div className="nav-group-item-wrapper">
          {this.props.items.map(this.createGroupItem)}
        </div>
      </div>
    )
  }

  // GROUP EVENTS

  handleToggleGroup = () => {
    this.props.dispatch(Actions.toggleGroup(this.props.groupID))
  }  

  handleRemoveGroup = () => {
    this.props.dispatch(Actions.removeNavGroup(this.props.groupID))
  }

  handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "copy"
  }

  handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()

    if(e.dataTransfer.files.length > 0) {
    let files = []

    _.forIn(e.dataTransfer.files, function(value, key) {
      if(_.hasIn(value, 'path'))
      files.push(value.path)
    })

    this.props.dispatch(Actions.addGroupItems(this.props.groupID, files))
    }
  }

  // GROUP TITLE EVENTS

  handleGroupTitleChange = (newTitle) => {
    this.props.dispatch(Actions.changeGroupTitle(this.props.groupID, newTitle))
  }

  /**
   * 
   * GROUP ITEM
   * 
   * @memberOf NavGroup
   */
  createGroupItem = (path, itemID) => {
    let basePath = nodePath.basename(path)
    let active = false
    if(path === this.props.activeItem)
    active = true
    let glyph = "folder"
    if(this.props.isDiskGroup)
    glyph = 'device'
    
    // if(path.ext) {
    //   let res = path.ext.replace(".", "")
    //   glyph = "file " + res
    // }

    return (
      <NavGroupItem
        key={itemID}
        onClick={this.handleSelectionChanged.bind(this, path)}
        onItemRemove={this.handleOnItemRemove.bind(this, itemID)}
        title={basePath}
        isDeletable={!this.props.isDiskGroup}
        active={active}
        glyph={glyph}
        draggable={!this.props.isDiskGroup && true}
        >
      </NavGroupItem>)
  }

  // GROUP ITEM EVENTS

  handleOnItemRemove = (itemID, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.dispatch(Actions.removeGroupItem(this.props.groupID, itemID))
  }

  handleSelectionChanged = (path, e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.dispatch(App.actions.changeAppPath(path))
  }
  
/**
 * Context Click menu for Title
 */
  onContextMenu = (event) => {
    event.preventDefault()
    event.stopPropagation()

    let menu = new Menu();
    // menu.append(new MenuItem({ label: 'Open "' + this.props.file.get('base') + '"', click: null }))
    // menu.append(new MenuItem({ label: 'Rename', click: null }))
    // menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: 'Remove Group', click: this.handleRemoveGroup }))
    menu.append(new MenuItem({ type: 'separator' }))
    let hideButtonText = this.props.hidden ? "show" : "hide"

    menu.append(new MenuItem({label: hideButtonText, click: this.handleToggleGroup }))

    menu.popup(remote.getCurrentWindow());
  }

}
