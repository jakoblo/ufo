"use strict"
import React from 'react'
import {keyMap} from './shortcut-map'
import _ from 'lodash'

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
// String.fromCharCode()
export default class Shortcuts extends React.Component {
  constructor(props) {
    super(props)

    this.shortcutMap = this.props.keyMap
  }

  render() {
    return(
      <div onKeyDown={this.handleEvent}>
        {this.props.children}
      </div>
    )
  }

  handleEvent = (event) => {
    let eventKeys = this.eventToString(event)
    console.log(eventKeys)

    // let targetKeys = this.stringToArray('Control+r')
    // console.log(_.isEqual(eventKeys, targetKeys))
  }

  eventToString(event) {
    let keys = []
    // Modifiers
    if(event.ctrlKey) { keys.push("Control") }
    if(event.shiftKey) { keys.push("Shift") }
    if(event.metaKey) { keys.push("Meta") }
    keys.push(event.key) // Main Key
    return _.uniq(keys).join('+')
  }

  // stringToArray(keyString) {
  //   return keyString.split("+").sort();
  // }
}



