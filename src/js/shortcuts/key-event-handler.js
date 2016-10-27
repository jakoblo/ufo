"use strict"
import React from 'react'
import _ from 'lodash'
import os from 'os'

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent

export function keyEventHandler (keyMap, callback) {
  return ( event )  => {
    let eventString = keyEventToString(event)
    let action = _.findKey(keyMap, (value) => {
      switch (typeof value) {
        case "string":
          return value == eventString
        case "object":
          return value[os.platform()] == eventString
        default:
          return false
      }
    }) 
    if(action) {
      event.preventDefault()
      event.stopPropagation()
    }
    callback(action, event)
  }
}

function keyEventToString(event) {
  let keys = []
  // Modifiers
  if(event.ctrlKey) { keys.push("Control") }
  if(event.shiftKey) { keys.push("Shift") }
  if(event.metaKey) { keys.push("Meta") }
  keys.push(event.key) // Main Key
  return _.uniq(keys).join('+')
}


