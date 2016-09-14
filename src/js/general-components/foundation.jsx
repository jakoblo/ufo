"use strict"
import React from 'react'
import { connect } from 'react-redux'

export default class Foundation extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="foundation"
        onDragEnter={this.stopEvent}
        onDragOver={this.stopEvent}
        onDrop={this.stopEvent}
      >{this.props.children}</div>
    )
  }

  stopEvent (e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "none"
  }
}

