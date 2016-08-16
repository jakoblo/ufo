"use strict"
import React from 'react'
import { connect } from 'react-redux'

export class Sidebar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <section className="sidebar">{this.props.children}</section>
    )
  }
}
