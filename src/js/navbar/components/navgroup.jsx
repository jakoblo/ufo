"use strict"
import React from 'react'
import { connect } from 'react-redux'
import nodePath from 'path'
import classnames from 'classnames'
import NavGroupItem from './navgroup-item'
import NavGroupTitle from './navgroup-title'

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
    if(this.props.isDefault)
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
        isDeletable={this.props.isDefault}
        active={active}
        glyph={glyph}
        >
      </NavGroupItem>)
  }

  handleOnTitleDoubleClick() {

  }

  render() {
    let hideButtonText = this.props.hidden ? "show" : "hide";
    let groupClasses = classnames({
      'nav-group': true,
      'hide': this.props.hidden
    });

    return(
      <div className={groupClasses} onDrop={this.props.onDrop}>
        <NavGroupTitle 
          title={this.props.title} 
          groupID={this.props.groupID} 
          onGroupTitleChange={this.props.onGroupTitleChange} 
          hideButtonText={hideButtonText} 
          onClick={this.props.onToggleGroup.bind(this, this.props.groupID)}
        />
        <div className="nav-group-item-wrapper">
          {this.props.items.map(this.createGroupItem)}
        </div>
      </div>
    )
  }
}
