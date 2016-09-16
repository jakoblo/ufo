"use strict"
import React from 'react'
import { connect } from 'react-redux'
import nodePath from 'path'
import classnames from 'classnames'
import NavGroupItem from './navgroup-item'
import NavGroupTitle from './navgroup-title'
import {remote} from 'electron'
const {Menu, MenuItem} = remote

export default class NavGroup extends React.Component {
  constructor(props) {
    super(props)
  }

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
        onClick={this.props.onSelectionChanged.bind(this, path)}
        onItemRemove={this.props.onItemRemove.bind(this, this.props.groupID, itemID)}
        title={basePath}
        isDeletable={this.props.isDiskGroup}
        active={active}
        glyph={glyph}
        >
      </NavGroupItem>)
  }

   /**
   * Right Click menu
   */
  onContextMenu = (event) => {
    event.preventDefault()
    event.stopPropagation()

    let menu = new Menu();
    // menu.append(new MenuItem({ label: 'Open "' + this.props.file.get('base') + '"', click: null }))
    // menu.append(new MenuItem({ label: 'Rename', click: null }))
    // menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: 'Remove Group', click: this.props.onRemoveGroup }))
    menu.append(new MenuItem({ type: 'separator' }))
    let hideButtonText = this.props.hidden ? "show" : "hide"

    menu.append(new MenuItem({label: hideButtonText, click: this.props.onToggleGroup.bind(this, this.props.groupID) }))

    menu.popup(remote.getCurrentWindow());
  }

  render() {
    let hideButtonText = this.props.hidden ? "show" : "hide";
    let groupClasses = classnames({
      'nav-group': true,
      'hide': this.props.hidden
    })
    const diskgroup = this.props.isDiskGroup
    return(
      <div className={groupClasses} onDrop={this.props.onDrop}>
        <NavGroupTitle 
          title={this.props.title}
          isDiskGroup={diskgroup}
          groupID={this.props.groupID} 
          onGroupTitleChange={!diskgroup && this.props.onGroupTitleChange} 
          hideButtonText={hideButtonText} 
          onClick={this.props.onToggleGroup.bind(this, this.props.groupID)}
          onContextMenu={!diskgroup && this.onContextMenu}
        />
        <div className="nav-group-item-wrapper">
          {this.props.items.map(this.createGroupItem)}
        </div>
      </div>
    )
  }
}
