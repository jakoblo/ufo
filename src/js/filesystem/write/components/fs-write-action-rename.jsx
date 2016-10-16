"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Button from '../../../general-components/button'
import nodePath from 'path'
import * as c from '../fs-write-constants'
import * as t from '../fs-write-actiontypes'
import * as FsWriteActions from '../fs-write-actions'

export default class WriteActionRename extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    return (
      <div className="rename">
        <div className="action-describe">
          Rename 
          <b> {nodePath.basename(this.props.action.get('source'))}</b>{' to '} 
          <b>{nodePath.basename(this.props.action.get('destination'))}</b>
        </div>
        {this.renderErrorMessage()}
      </div>
    )
  }

  renderErrorMessage = () => {
    if(this.props.action.getIn(['error', 'code'])) {

      let errorMessage
      switch (this.props.action.getIn( ['error', 'code'])) {
        
        case c.ERROR_DEST_ALREADY_EXISTS:
          errorMessage = 'There is already a file with the name '+nodePath.basename(this.props.action.get('destination'))
          break;
        
        case c.ERROR_NO_ACCESS:
          errorMessage = "I don't have the permission to do that."
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