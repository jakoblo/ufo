"use strict"
import React from 'react'
import classnames from 'classnames'

export default class VoidCursorEmulator extends React.Component {

  constructor(props) {
    super(props)
  }

 render() {

    const classes = classnames({
      "void-cursor-emulator": true,
      "void-cursor-emulator--cursor-left": this.props.cursorLeft,
      "void-cursor-emulator--cursor-right": this.props.cursorRight
    })

    return (
      <div
        className={classes}
        onClick={ (event) => {
          // Prevent Selection change in slate editor
          event.stopPropagation()
          event.preventDefault()
          //this.props.focusEditor()
        }} >
        {this.props.children}
      </div>
    )
  }
}


