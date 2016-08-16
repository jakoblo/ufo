"use strict"
import React from 'react'
import { connect } from 'react-redux'

export class ViewContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <section className="viewContainer">ViewContainer{this.props.children}</section>
    )
  }
}
