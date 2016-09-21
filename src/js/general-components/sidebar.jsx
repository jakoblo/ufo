"use strict"
import React from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
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
