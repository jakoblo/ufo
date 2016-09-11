"use strict"
import React from 'react'
import { connect } from 'react-redux'

export class Foundation extends React.Component {
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
      <div className="foundation" 
      onDrop={this.handleDrop}
      onDragOver={this.handleDragOver}
      >{this.props.children}</div>
    )
  }
}
