"use strict"
import React from 'react'
import History from '../history/history-index'
import Button from './button'

export default class ActionBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="toolbar">
        <WindowControls></WindowControls>
        <History.components.Buttons />
      </div>
    )
  }
}

class WindowControls extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
     <div className="window-controls">
      <Button key={1} className="close" onClick={this.handleClick.bind(this, "close")}/>
      <Button key={2} className="minimize" onClick={this.handleClick.bind(this, "minimize")}/>
      <Button key={3} className="maximize" onClick={this.handleClick.bind(this, "maximize")}/>
     </div>
    )
  }

handleClick(value) {
    let window = remote.getCurrentWindow()
    switch (value) {
      case "close":
        window.close()
        break;
      case "minimize":
        window.minimize()
        break;
      case "maximize":
        window.maximize()
        break;
      default:
        break;
    }
  }
}
