"use strict"
import React from 'react'

export class NavGroupTitle extends React.Component {

  constructor(props) {
    super(props)
  }

 render() {
    return (
      <div className="nav-group-title">
        <span className="nav-group-text">{this.props.title}</span>
        <button className="nav-group-hide" onClick={this.props.onClick}>{this.props.hideButtonText}</button>
      </div>
    )
  }
  // <Button className="nav-group-hide" text={this.props.hideButtonText} onClick={this.props.onHide}/>
}
