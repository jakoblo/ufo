"use strict"
import React from 'react'
import { connect } from 'react-redux'

export class NavGroupItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <section className="viewContainer">ViewContainer{this.props.children}</section>
    )
  }
}
