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
import { DropTarget, DragSource } from 'react-dnd'
import { findDOMNode } from 'react-dom'
import { NativeTypes } from 'react-dnd-html5-backend'


const groupTarget = {
  drop(props, monitor, component) {
    if(monitor.getItemType() === NativeTypes.FILE) {
      if (props.isDiskGroup) return
      if(monitor.getItem().files.length > 0) {
        let files = []
        _.forIn(monitor.getItem().files, function(value, key) {
        if(_.hasIn(value, 'path'))
        files.push(value.path)
        })
        props.dispatch(Actions.addGroupItems(props.groupID, files))
      }
    } else if(monitor.getItemType() === DnDTypes.NAVGROUP) {
      props.dispatch(Actions.saveFavbartoStorage())
    }
  }, 
  hover(props, monitor, component) {
    if(monitor.getItemType() !== DnDTypes.NAVGROUP) return

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
    props.dispatch(Actions.moveNavGroup(dragIndex, hoverIndex))

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
}

const groupSource = {
  beginDrag(props) {
    return {
      id: props.groupID,
      index: props.index
    };
  }
}

//https://gaearon.github.io/react-dnd/examples-sortable-simple.html
@DropTarget([DnDTypes.NAVGROUP, NativeTypes.FILE], groupTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver() && (monitor.getItemType() === NativeTypes.FILE),
  isOverCurrent: monitor.isOver({ shallow: true })
}))
@DragSource(DnDTypes.NAVGROUP, groupSource, (connect, monitor) => ({
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDragSource: connect.dragSource(),
  // You can ask the monitor about the current drag state:
  isDragging: monitor.isDragging(),
}))
export default class NavGroup extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { isOver, isDragging, connectDragSource, connectDropTarget } = this.props;
    const dg = this.props.isDiskGroup
    const dndStyle = { backgroundColor: isOver ? '#AFD2E8' : '', opacity: isDragging ? 0 : 1 }

    let hideButtonText = this.props.hidden ? "show" : "hide";
    let classname = classnames({
      'nav-group': true,
      'hide': this.props.hidden
    })

    return connectDragSource(connectDropTarget(
      <div className={classname} style={dndStyle}>
        <NavGroupTitle 
          title={this.props.title}
          isDiskGroup={dg}
          onGroupTitleChange={!dg && this.handleGroupTitleChange} 
          hideButtonText={hideButtonText} 
          onToggleGroup={this.handleToggleGroup.bind(this, this.props.index)}
          onContextMenu={!dg && this.onContextMenu}
        />
        <div className="nav-group-item-wrapper">
          {this.props.items.map(this.createGroupItem)}
        </div>
      </div>
    ))
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
   * @memberOf NavGroup
   */
  createGroupItem = (item, index) => {
    const path = item.path
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
        key={item.id}
        index={index}
        groupID={this.props.groupID}
        onClick={this.handleSelectionChanged.bind(this, path)}
        onItemRemove={this.handleOnItemRemove.bind(this, index)}
        title={basePath}
        isDiskGroup={this.props.isDiskGroup}
        active={active}
        glyph={glyph}
        onMoveGroupItem={this.handleMoveGroupItem}
        saveFavbar={this.handleSaveFavbar}
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
    e.preventDefault()
    e.stopPropagation()
    this.props.dispatch(App.actions.changeAppPath(path))
  }

  handleMoveGroupItem = (dragIndex, hoverIndex) => {
    this.props.dispatch(Actions.moveGroupItem(this.props.index, dragIndex, hoverIndex))
  }

  handleSaveFavbar = () => {
    this.props.dispatch(Actions.saveFavbartoStorage())
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
