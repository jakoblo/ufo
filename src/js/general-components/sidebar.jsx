"use strict"
import React from 'react'

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <section className="sidebar">{this.props.children}</section>
    )
  }
}
