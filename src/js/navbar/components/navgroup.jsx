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
import _ from 'lodash'
const {Menu, MenuItem} = remote

export default class NavGroup extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const dg = this.props.isDiskGroup
    let hideButtonText = this.props.hidden ? "show" : "hide";
    let classname = classnames({
      'nav-group': true,
      'hide': this.props.hidden
    })

    return(
      <div className={classname} onDrop={this.handleDrop.bind(this)} onDragOver={this.handleDragOver}>
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
        >
      </NavGroupItem>)
  }

  // GROUP ITEM EVENTS

  handleOnItemRemove = (itemID) => {
    this.props.dispatch(Actions.removeGroupItem(this.props.groupID, itemID))
  }

  handleSelectionChanged = (path) => {
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
