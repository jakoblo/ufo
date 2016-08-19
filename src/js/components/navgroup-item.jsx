"use strict"
import React from 'react'
import classnames from 'classnames'

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
  handleClick = () => {
    this.props.onClick()
  }

 render() {
    // let icon = this.getIconComponent()
    let className = classnames(this.props.className, "nav-group-item", {"active": this.props.active})

    return (
      <a
      onClick={this.props.onClick}
      className={className}
      >
        <span className="text">{this.props.path}</span>
        <button onClick={this.props.onClick} className="remove"></button>
      </a>
    )
  }
}
