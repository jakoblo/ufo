"use strict"
import React from 'react'
import { connect } from 'react-redux'
import { NavGroupItem } from './navgroup-item'
import { NavGroupTitle } from './navgroup-title'
import nodePath from 'path'

export class NavGroup extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClick = (e) =>   {
      console.log(this.props.dispatch)
  }

  renderItem = (path, itemID) => {
    let basePath = nodePath.basename(path)
    let active = false
    if(itemID == this.props.activeItem)
    active = true

    return (
      <NavGroupItem
        key={itemID}
        onClick={this.props.onSelectionChanged.bind(this, path, this.props.groupID, itemID)}
        path={basePath}
        active={active}
        >
      </NavGroupItem>)
  }

  handleFeedback() {
    console.log("FEEDBACK")
  }

  render() {
    return(
      <div className="nav-group">
        <NavGroupTitle title={this.props.title} />
        <div className={"nav-group-item-wrapper"}>
          {this.props.items.map(this.renderItem)}
        </div>
      </div>
    )
  }
}
