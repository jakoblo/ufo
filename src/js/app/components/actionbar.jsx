"use strict"
import React from 'react'
import { connect } from 'react-redux'
import { toggleEditMode } from '../../config/config-actions'
import { List } from 'immutable'
import classnames from 'classnames'
import { remote } from 'electron'
import ButtonGroup from '../../general-components/button-group'
import Button from '../../general-components/button'
import { ActionCreators } from 'redux-undo';

@connect((state) => {
  return {navbar: state.navbar}
})
export default class ActionBar extends React.Component {
  constructor(props) {
  super(props)
  }

  handleHistoryBack = () => {
    this.props.dispatch(ActionCreators.undo())
  }

  handleHistoryForward = () => {
    this.props.dispatch(ActionCreators.redo())
  }

  handleFolderUp = () => {

  }

  render() {
    let canUndo = this.props.navbar.past.length > 0
    let canRedo = this.props.navbar.future.length > 0
    return (
      <div className="toolbar">
        <WindowControls></WindowControls>
        <ButtonGroup>
          <Button className="icon arrow-back" active={canUndo} onClick={this.handleHistoryBack} />
          <Button className="icon arrow-forward" active={canRedo} onClick={this.handleHistoryForward} />
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
