"use strict"
import React from 'react'
import { connect } from 'react-redux'
import { changeGroupName, hideGroup, removeGroupItem, changeGroupTitle } from '../navbar-actions'
import App from '../../app/app-index'
import * as constants from '../navbar-constants'
import { List, Map } from 'immutable'
import NavGroup from './navgroup'

@connect((state) => {
  return {navbar: state[constants.NAME].present
  }
})
export default class Navbar extends React.Component {
  constructor(props) {
    super(props)
  }


  handleSelectionChanged = (path, groupID, itemID) => {
    console.log("SELECTION CHANGED")
    this.props.dispatch(App.actions.changeAppPath(path))
  }

  handleOnHideGroup = (groupID) => {
    this.props.dispatch(hideGroup(groupID))
  }

  handleOnItemRemove = (groupID, itemID) => {
    this.props.dispatch(removeGroupItem(groupID, itemID))
  }

  handleOnGroupTitleChange = (groupID, newTitle) => {
    this.props.dispatch(changeGroupTitle(groupID, newTitle))
  }

  createNavGroups = (item, index) => {
    return (<NavGroup
        key={index}
        groupID={index}
        activeItem={this.props.navbar.get("activeItem")}
        title={item.title}
        items={item.items}
        hidden={item.hidden}
        onSelectionChanged={this.handleSelectionChanged}
        onItemRemove={this.handleOnItemRemove}
        onGroupTitleChange={this.handleOnGroupTitleChange}
        onHideGroup={this.handleOnHideGroup}>
      </NavGroup>)
  }

  render() {
    let navgroups = null
    if(this.props.navbar.has('groupItems')) 
    navgroups = this.props.navbar.get('groupItems').toJS().map(this.createNavGroups)
    return(
      <div className="nav-bar">
        {navgroups}
      </div>
    )
  }


}
