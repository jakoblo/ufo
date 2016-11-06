"use strict"
import React from 'react'
import { connect } from 'react-redux'
import {remote} from 'electron'
import classnames from 'classnames'
import * as AppActions from '../app-actions'
import * as selectors from '../app-selectors'
import WindowControls from './window-controls'

@connect((state) => {
  return {
    history: state.app.get('history'),
  }
})
export default class AppControls extends React.Component {
  constructor(props) {
    super(props)
  }

  render() { 
    let historyPosition = this.props.history.get('position')
    let historySequence = this.props.history.get('sequence')
    let buttonForwardClasses = classnames({
      'history-controls__button-forward': true,
      'history-controls__button-forward--disabled': !(historyPosition < historySequence.size - 1),
    })
    let buttonBackClasses = classnames({
      'history-controls__button-back': true,
      'history-controls__button-back--disabled': !(historyPosition > 0),
    })
    return (
      <div className="app-controls">
        <WindowControls />
        <div className="history-controls">
          <button className={buttonBackClasses} onClick={this.handleHistoryBack} />
          <button className={buttonForwardClasses} onClick={this.handleHistoryForward} />
        </div>
        <button className="app-controls__button-path-up" onClick={this.handleFolderUp} />
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.history !== this.props.history
  }

  handleHistoryBack = () => {
    this.props.dispatch( AppActions.historyBack() )
  }

  handleHistoryForward = () => {
    this.props.dispatch( AppActions.historyForward() )
  }

  handleFolderUp = () => {
    this.props.dispatch( AppActions.navigateToParentFolder() )
  }
}