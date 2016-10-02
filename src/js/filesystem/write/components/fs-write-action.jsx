"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Button from '../../../general-components/button'
import nodePath from 'path'
import * as c from '../fs-write-constants'
import * as FsWriteActions from '../fs-write-actions'

export default class WriteAction extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className={classNames({
          'write-action': true,
          'finished': this.props.action.get('finished'),
          'error': this.props.action.get('error')
        })}
      >
        {this.renderClose()}
        <div className="action-describe">
          {(this.props.action.get('move')) ? 'move ' : 'copy '} 
          <b>{nodePath.basename(this.props.action.get('source'))}</b>{' to '} 
          <b>{nodePath.basename(nodePath.dirname(this.props.action.get('destination')))}</b>
        </div>
        {this.renderErrorMessage()} 
        {this.renderConfirm()} 
        {this.renderProgressing()}
      </div>
    )
  }

  renderClose = () => {
    if(this.props.action.get('finished') || this.props.action.get('error')) {
      return <Button text="X" onClick={
                () => { this.props.dispatch( FsWriteActions.removeAction(this.props.action.get('id')) ) }
              }/> 
    } else {
      return null
    }
  }

  renderErrorMessage = () => {
    if(this.props.action.getIn(['error', 'code'])) {
      return  <div className="error-handling">
                <p className="error-message">
                  {c.MESSAGES[this.props.action.getIn(['error', 'code'])]}
                </p>
                <div className="error-actions">
                  <Button className="try-again" text="Try Again" onClick={
                    () => {
                      FsWriteActions.startFsWorker(
                        this.props.action.get('source'),
                        this.props.action.get('destination'),
                        {
                          move: this.props.action.get('move'),
                          clobber: this.props.action.get('clobber')
                        },
                        this.props.action.get('id')
                      )
                    }
                  }/>
                </div>
              </div>
    } else {
      return null
    }
  }

  renderConfirm = () => {
    if(this.props.action.get('error') && this.props.action.getIn(['error', 'code']) == c.ERROR_DEST_ALREADY_EXISTS) {
      return  <div className="confirm">
                <Button text="Overwrite" onClick={
                  () => {
                    FsWriteActions.startFsWorker(
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
    } else {
      return null
    }
  }

  renderProgressing = () => {
    if(this.props.action.get('files').size > 0){
      return <div className="progressing-files">
              {
                this.props.action.get('files').valueSeq().map((progFile, index) => {
                  return  <div key={index} className="progressing-file">
                            {nodePath.basename(progFile.get('destination'))}
                            <progress max="100" value={progFile.get('progress').get('percentage')}></progress>
                          </div>
                })
              }
            </div>
    } else {
      return null
    }
  } 

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.action !== this.props.action // || nextState.data !== this.state.data;
  }

  // setImmState(fn) {
  //   // https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state
  //   return this.setState(({data}) => ({
  //     data: fn(data)
  //   }));
  // }
}
