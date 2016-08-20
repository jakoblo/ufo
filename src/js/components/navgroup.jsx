"use strict"
import React from 'react'
import { connect } from 'react-redux'
import { NavGroupItem } from './navgroup-item'
import { NavGroupTitle } from './navgroup-title'
import nodePath from 'path'
import classnames from 'classnames'

export class NavGroup extends React.Component {
  constructor(props) {
    super(props)
  }

  renderItem = (path, itemID) => {
    let basePath = nodePath.basename(path)
    let active = false
    if(path === this.props.activeItem)
    active = true

    return (
      <NavGroupItem
        key={itemID}
        onClick={this.props.onSelectionChanged.bind(this, path)}
        path={basePath}
        active={active}
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
          {this.props.items.map(this.renderItem)}
        </div>
      </div>
    )
  }
}
