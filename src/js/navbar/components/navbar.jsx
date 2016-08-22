"use strict"
import React from 'react'
import { connect } from 'react-redux'
import { changeGroupName, hideGroup, removeGroupItem, changeGroupTitle } from '../navbar-actions'
import App from '../../app/app-index'
import { List } from 'immutable'
import NavGroup from './navgroup'

@connect((store) => {
  // console.log("STORE ", store.toJS())
  return {navbar: store.navbar,
          groupItems: store.navbar.get('groupItems')
  }
})
export default class Navbar extends React.Component {
  constructor(props) {
    super(props)
  }


  handleSelectionChanged = (path, groupID, itemID) => {
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

  render() {
    let groups = this.props.groupItems.toJS().map((item, index) => {
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
        {groups}
      </div>
    )
  }


}
