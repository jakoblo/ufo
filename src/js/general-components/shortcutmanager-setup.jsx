"use strict"
import React from 'react'

export default class ShortcutManagerSetup extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div>{this.props.children}</div>
    )
  }

  getChildContext = function() {
    return {
      shortcuts: this.props.shortcutManager
    };
  }
}

ShortcutManagerSetup.childContextTypes = {
  shortcuts: React.PropTypes.object.isRequired
}

