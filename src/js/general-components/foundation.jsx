"use strict"
import React from 'react'
import { connect } from 'react-redux'

export class Foundation extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="foundation">{this.props.children}</div>
    )
  }
}
