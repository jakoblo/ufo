"use strict"
import React from 'react'
import classnames from 'classnames'
import Icon from '../../general-components/icon'
import Button from '../../general-components/button'

export default class NavGroupItem extends React.Component {
  constructor(props) {
    super(props)
  }

 render() {
    // let icon = this.getIconComponent()
    let className = classnames(this.props.className, "nav-group-item", {"active": this.props.active})
    let deleteButton = <Button className="remove" onClick={this.props.onItemRemove}></Button>

    return (
      <a onClick={this.props.onClick} draggable={this.props.draggable} className={className}>
        <Icon glyph={this.props.glyph} />
        <span className="text">{this.props.title}</span>
        {this.props.isDeletable && deleteButton}
      </a>
    )
  }
}
