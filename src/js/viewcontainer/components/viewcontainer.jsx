"use strict"
import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'

@connect((store) => {
  // console.log("STORE ", store.toJS())
  return {
    viewcontainer: store.viewcontainer
  }
})
export default class ViewContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <section className="viewContainer">
        ViewContainer
        {this.props.children}
      </section>
    )
  }
}
