"use strict"
import React from 'react'
import classnames from 'classnames'
import Icon from './icon'

export default class Button extends React.Component {

  constructor(props) {
    super(props)
  }

getIconComponent() {
    if(this.props.glyph)
    return <Icon glyph={this.props.glyph} />
  }

 render() {
    let icon = this.getIconComponent()

    let className = classnames(
      this.props.className, {
        'is-active': !(this.props.active == false),
        'display-text': this.props.text && this.props.text.length > 0
      })

    return (
      <button
      onClick={this.props.onClick}
      className={className}>
        {icon}{this.props.text}
      </button>
    )
  }
}
