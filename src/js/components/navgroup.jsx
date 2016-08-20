"use strict"
import React from 'react'
import { connect } from 'react-redux'
import nodePath from 'path'
import classnames from 'classnames'
import  Icon from './icon'

export class NavGroup extends React.Component {
  constructor(props) {
    super(props)
  }

  createGroupItem = (path, itemID) => {
    let basePath = nodePath.basename(path)
    let active = false
    if(path === this.props.activeItem)
    active = true
    let glyph = "folder"
    // if(path.ext) {
    //   let res = path.ext.replace(".", "")
    //   glyph = "file " + res
    // }

    return (
      <NavGroupItem
        key={itemID}
        onClick={this.props.onSelectionChanged.bind(this, path)}
        onItemRemove={this.props.onItemRemove.bind(this,this.props.groupID, itemID)}
        path={basePath}
        active={active}
        glyph={glyph}
        >
      </NavGroupItem>)
  }

  handleFeedback() {
    console.log("FEEDBACK")
  }

  render() {
    let hideButtonText = this.props.hidden ? "show" : "hide";
    let itemWrapperClasses = classnames({
      'nav-group-item-wrapper': true,
      'hide': this.props.hidden
    });
    return(
      <div className="nav-group">
        <NavGroupTitle title={this.props.title} hideButtonText={hideButtonText} onClick={this.props.onHideGroup.bind(this, this.props.groupID)}/>
        <div className={itemWrapperClasses}>
          {this.props.items.map(this.createGroupItem)}
        </div>
      </div>
    )
  }
}

export class NavGroupItem extends React.Component {

  constructor(props) {
    super(props)
  }

  // private getIconComponent() {
  //   if(this.props.glyph)
  //
  //   return <Icon glyph={this.props.glyph} />
  // }
  //

 render() {
    // let icon = this.getIconComponent()
    let className = classnames(this.props.className, "nav-group-item", {"active": this.props.active})

    return (
      <a
      onClick={this.props.onClick}
      className={className}
      >
        <Icon glyph={this.props.glyph} />
        <span className="text">{this.props.path}</span>
        <button className="remove" onClick={this.props.onItemRemove}></button>
      </a>
    )
  }
}

export class NavGroupTitle extends React.Component {

  constructor(props) {
    super(props)
  }

 render() {
    return (
      <div className="nav-group-title">
        <span className="nav-group-text">{this.props.title}</span>
        <button className="nav-group-hide" onClick={this.props.onClick}>{this.props.hideButtonText}</button>
      </div>
    )
  }
  // <Button className="nav-group-hide" text={this.props.hideButtonText} onClick={this.props.onHide}/>
}
