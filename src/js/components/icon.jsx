"use strict"
import React from 'react'
import classnames from 'classnames'

export default class Icon extends React.Component {

  constructor(props) {
    super(props)
  }

 render() {
    let className = classnames('icon', this.props.glyph)
    return (
      <i className={className} />
    )
  }
}
