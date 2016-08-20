"use strict"
import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'

@connect((store) => {
  // console.log("STORE ", store.toJS())
  return {
    viewContainer: store.viewContainer
  }
})
export class ViewContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <section className="viewContainer">
        ViewContainer
        <p>{this.props.viewContainer.get(0)}</p>
      </section>
    )
  }
}
