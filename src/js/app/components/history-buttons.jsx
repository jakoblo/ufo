"use strict"
import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import ButtonGroup from '../../general-components/button-group'
import Button from '../../general-components/button'
import * as AppActions from '../app-actions'
import * as selectors from '../app-selectors'

@connect((state) => {
  return {
    history: state.app.get('history'),
  }
})
export default class ActionBar extends React.Component {
  constructor(props) {
    super(props) 
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

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.history !== this.props.history
  }

  render() {

    let historyPosition = this.props.history.get('position')
    let historySequence = this.props.history.get('sequence')
    let backActive = (historyPosition > 0)
    let forwardActive = (historyPosition < historySequence.size - 1)

    return (
      <ButtonGroup>
        <Button className="icon arrow-back" active={backActive} onClick={this.handleHistoryBack} />
        <Button className="icon arrow-forward" active={forwardActive} onClick={this.handleHistoryForward} />
        <Button className="icon arrow-up" onClick={this.handleFolderUp}/>
      </ButtonGroup>
    )
  }
}
