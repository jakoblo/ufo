"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Button from '../../../general-components/button'
import * as c from '../fs-write-constants'
import * as t from '../fs-write-actiontypes'
import * as FsWriteActions from '../fs-write-actions'

import WriteActionTrash from './fs-write-action-trash'
import WriteActionCopyMove from './fs-write-action-copy-move'
import WriteActionRename from './fs-write-action-rename'

export default class WriteAction extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    
    let ActionType
    switch (this.props.action.get('task')) {
      case t.TASK_MOVE:
        ActionType = WriteActionCopyMove
        break
      case t.TASK_COPY:
        ActionType = WriteActionCopyMove
        break
      case t.TASK_RENAME:
        ActionType = WriteActionRename
        break
      case t.TASK_TRASH:
        ActionType = WriteActionTrash
        break
    }

    return (

      <div
        className={classNames({
          'fs-write-action': true,
          'fs-write-action--finished': this.props.action.get('finished'),
          'fs-write-action--error': this.props.action.get('error')
        })}
      >
        {this.renderClose()}
        <ActionType action={this.props.action} dispatch={this.props.dispatch} />
      </div>
    )
  }

  renderClose = () => {
    if(this.props.action.get('finished') || this.props.action.get('error')) {
      return <button className="fs-write-action__button-close" onClick={
                () => { this.props.dispatch( FsWriteActions.removeAction(this.props.action.get('id')) ) }
              }/> 
    } else {
      return null
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.action !== this.props.action // || nextState.data !== this.state.data;
  }
}
