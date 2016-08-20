"use strict"
import React from 'react'
import classnames from 'classnames'
import  Icon from './icon'

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
        <button className="remove"></button>
      </a>
    )
  }
}
