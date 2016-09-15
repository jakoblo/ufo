"use strict"
import React from 'react'
import { connect } from 'react-redux'

export default class Foundation extends React.Component {
  constructor(props) {
    super(props)
  }

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    return(
<<<<<<< HEAD
      <div className="foundation" 
      onDrop={this.handleDrop}
      onDragOver={this.handleDragOver}
=======
      <div className="foundation"
        onDragEnter={this.stopEvent}
        onDragOver={this.stopEvent}
        onDrop={this.stopEvent}
>>>>>>> master
      >{this.props.children}</div>
    )
  }

  stopEvent (e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "none"
  }
}

