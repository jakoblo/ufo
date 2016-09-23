"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Button from '../../../general-components/button'
import {Map} from 'immutable'
import nodePath from 'path'
import * as c from '../fs-write-constants'
import * as FsWriteActions from '../fs-write-actions'

export default class WriteAction extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    let progressing, errorMessage, confirm, actionType, status = null

    actionType = (this.props.action.get('move')) ? 'move' : 'copy'
    status = 'doing'
    if(this.props.action.get('finished')) {
      status = "Finished"
    }
    if(this.props.action.get('error')) {
      console.log(this.props.action.get('error').toJS())
      status = "Error"
      errorMessage = <p>{c.MESSAGES[this.props.action.getIn(['error', 'code'])]}</p>
    }

    progressing = this.props.action.get('files').valueSeq().map((progFile, index) => {

      return  <div key={index} className="progressing-file">
                {nodePath.basename(progFile.get('destination'))}
                <progress max="100" value={progFile.get('progress').get('percentage')}></progress>
              </div>
    })

    if(this.props.action.get('error') && this.props.action.getIn(['error', 'code']) == c.ERROR_DEST_ALREADY_EXISTS) {
      confirm = 
      <div className="confirm">
        <Button text="Overwrite" onClick={
          () => {
            FsWriteActions.createFsWorker(
              this.props.action.get('source'),
              this.props.action.get('destination'),
              {...this.props.action.get('options'), clobber: true},
              this.props.action.get('id')
            )
          }
        }/>
        <Button text="Cancel" onClick={() => {
          this.props.dispatch(FsWriteActions.removeAction(this.props.action.get('id')))
        }}
          />
      </div>
    }

    return (
      <div
        className={classNames({
          'write-action': true,
          'finished': this.props.action.get('finished'),
          'error': this.props.action.get('error')
        })}
      >
        <br/>{status}<br/>
        {actionType + ' '} 
        <b>{nodePath.basename(this.props.action.get('source'))}</b>{' to '} 
        <b>{nodePath.basename(nodePath.dirname(this.props.action.get('destination')))}</b> 
        {errorMessage} {confirm} {progressing}
      </div>
    )
  }

  // setImmState(fn) {
  //   // https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state
  //   return this.setState(({data}) => ({
  //     data: fn(data)
  //   }));
  // }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.action !== this.props.action // || nextState.data !== this.state.data;
  }
}
