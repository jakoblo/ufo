"use strict"
import React from 'react'
import { connect } from 'react-redux'
import * as Actions from '../navbar-actions'
import * as constants from '../navbar-constants'
import NavGroup from './navgroup'
import nodePath from 'path'
import _ from 'lodash'
import {remote} from 'electron'
import { DropTarget } from 'react-dnd'
import classnames from 'classnames'
import { NativeTypes } from 'react-dnd-html5-backend';

const NavbarTarget = {
  drop(props, monitor) {
    console.log(props)
  if(monitor.getItem().files.length > 0) {
    let title = _.last(_.split(nodePath.dirname(monitor.getItem().files[0].path), nodePath.sep))
    
    let files = []
    _.forIn(monitor.getItem().files, function(value, key) {
      if(_.hasIn(value, 'path'))
      files.push(value.path)
    })
    props.dispatch(Actions.addNavGroup(title, files))
    }
  }
}

@connect((state) => {
  return {navbar: state[constants.NAME].present,
    state: state
  }
})
@DropTarget(NativeTypes.FILE, NavbarTarget, (connect, monitor) => ({
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDropTarget: connect.dropTarget(),
  // You can ask the monitor about the current drag state:
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType()
}))
export default class Navbar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let navgroups = null
    if(this.props.navbar.has('groupItems')) 
    navgroups = this.props.navbar.get('groupItems').toJS().map(this.createNavGroup)

    const { isOver, canDrop, connectDropTarget, isOverCurrent } = this.props;

    let classname = classnames({
      'nav-bar': true,
      'hide': this.props.hidden
    })

    let dropStyle = { backgroundColor: '#AFD2E8' }
    if(!isOver) dropStyle = {backgroundColor: ""}

    return connectDropTarget(
      <div className={classname} style={dropStyle}>
        {navgroups}
      </div>
    )
  }

  createNavGroup = (item, index) => {
    return (<NavGroup
      key={index}
      index={index}
      groupID={item.id}
      activeItem={this.props.navbar.get("activeItem")}
      title={item.title}
      items={item.items}
      hidden={item.hidden}
      isDiskGroup={item.title === constants.DISKS_GROUP_NAME ? true : false}
      dispatch={this.props.dispatch}
      />)
  }
}

