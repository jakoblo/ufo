"use strict"
import React from 'react'
import { connect } from 'react-redux'
import { toggleEditMode } from '../actions/configActions'
import { List } from 'immutable'
import classnames from 'classnames'
import { remote } from 'electron'
import ButtonGroup from './buttonGroup'
import Button from './button'

@connect((state) => {
  return {foo: state}
})
export default class ActionBar extends React.Component {
  constructor(props) {
  super(props)
  }

  handleHistoryBack = () => {

  }

  handleHistoryForward = () => {

  }

  handleFolderUp = () => {

  }

  render() {
    return (
      <div className="toolbar">
        <WindowControls></WindowControls>
        <ButtonGroup>
          <Button className="icon arrow-back" onClick={this.handleHistoryBack} />
          <Button className="icon arrow-forward" onClick={this.handleHistoryForward} />
          <Button className="icon arrow-up" onClick={this.handleFolderUp}/>
        </ButtonGroup>
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
