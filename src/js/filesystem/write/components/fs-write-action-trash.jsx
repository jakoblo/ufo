"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Button from '../../../general-components/button'
import nodePath from 'path'
import * as c from '../fs-write-constants'
import * as t from '../fs-write-actiontypes'
import * as FsWriteActions from '../fs-write-actions'

export default class WriteActionTrash extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="trash">
        <div className="action-describe">
          Move 
          <b> {nodePath.basename(this.props.action.get('source'))}</b>{' to '} 
          <b>trash</b>
        </div>
        {this.renderErrorMessage()}
      </div>
    )
  }

  renderErrorMessage = () => {
    if(this.props.action.getIn(['error', 'code'])) {

      let errorMessage
      switch (this.props.action.getIn(['error', 'code'])) {
        case 1:
          errorMessage = "I don't have the permission to do that"
          break;
        default:
          errorMessage = "Error: code "+this.props.action.getIn(['error', 'code'])+'\n'+JSON.stringify(this.props.action.get('error'))
          break;
      }

      return  <div className="error-handling">
                <p className="error-message">
                  {errorMessage}
                </p>
              </div>
    } else {
      return null
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.action !== this.props.action // || nextState.data !== this.state.data;
  }
}
