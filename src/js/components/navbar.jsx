"use strict"
import React from 'react'
import { connect } from 'react-redux'
import { changeSelection, changeGroupName, hideGroup, removeGroupItem, changeGroupTitle } from '../actions/navbarActions'
import {NavGroup} from './navgroup'
import { List } from 'immutable'

@connect((store) => {
  // console.log("STORE ", store.toJS())
  return {navbar: store.navbar,
          groupItems: store.navbar.get('groupItems')
  }
})
export class Navbar extends React.Component {
  constructor(props) {
    super(props)
  }


  handleSelectionChanged = (path, groupID, itemID) => {
    this.props.dispatch(changeSelection(path))
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

  render() {
    let groupItems = this.props.groupItems.toJS()
    let x = groupItems.map((item, index) => {
      return <NavGroup
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
      </NavGroup>
    })
    return(
      <div className="nav-bar">
        {x}
      </div>
    )
  }


}
