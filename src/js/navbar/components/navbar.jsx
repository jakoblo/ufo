"use strict"
import React from 'react'
import { connect } from 'react-redux'
import { toggleGroup, removeGroupItem, changeGroupTitle, addNavGroup, saveFavbartoStorage, addGroupItems } from '../navbar-actions'
import App from '../../app/app-index'
import * as constants from '../navbar-constants'
import { List, Map } from 'immutable'
import NavGroup from './navgroup'
import Selection from '../../selection/sel-index'
import nodePath from 'path'


@connect((state) => {
  return {navbar: state[constants.NAME].present,
    state: state
  }
})
export default class Navbar extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSelectionChanged = (path, groupID, itemID) => {
    this.props.dispatch(App.actions.changeAppPath(path))
  }

  handleOnToggleGroup = (groupID) => {
    this.props.dispatch(toggleGroup(groupID))
  }

  handleOnItemRemove = (groupIndex, itemID) => {
    // const groupIndex = this.props.navbar.get('groupItems').findIndex(group => group.get('title') === groupTitle)
    this.props.dispatch(removeGroupItem(groupIndex, itemID))
  }

  handleOnGroupTitleChange = (groupID, newTitle) => {
    this.props.dispatch(changeGroupTitle(groupID, newTitle))
  }

  handleDrop = (e) => {
    console.log("nav")
    
    e.preventDefault()
    e.stopPropagation()
    
    let selection = Selection.selectors.getSelection(this.props.state)
    let selectedFiles = selection.get('files').toJS().map((filename) => {
      return nodePath.join(selection.get('root'), filename)
    })
    this.props.dispatch(addNavGroup("New Group", selectedFiles))
  } 

  handleNavGroupDrop(groupID, e) {
    console.log(e, groupID)
    e.preventDefault()
    let selection = Selection.selectors.getSelection(this.props.state)
    let selectedFiles = selection.get('files').toJS().map((filename) => {
      return nodePath.join(selection.get('root'), filename)
    })
    this.props.dispatch(addGroupItems(groupID, selectedFiles))
    
    console.log(selectedFiles)
  }

  createNavGroup = (item, index) => {
   
    return (<NavGroup
        key={index}
        groupID={index}
        activeItem={this.props.navbar.get("activeItem")}
        title={item.title}
        items={item.items}
        hidden={item.hidden}
        isDefault={item.title === constants.DISKS_GROUP_NAME ? true : false}
        onSelectionChanged={this.handleSelectionChanged}
        onItemRemove={this.handleOnItemRemove}
        onGroupTitleChange={this.handleOnGroupTitleChange}
        onToggleGroup={this.handleOnToggleGroup}
        onDrop={this.handleNavGroupDrop.bind(this, index)}>
      </NavGroup>)
  }

  render() {
    let navgroups = null
    if(this.props.navbar.has('groupItems')) 
    navgroups = this.props.navbar.get('groupItems').toJS().map(this.createNavGroup)
    return(
      <div className="nav-bar" onDrop={this.handleDrop}>
        {navgroups}
      </div>
    )
  }


}
