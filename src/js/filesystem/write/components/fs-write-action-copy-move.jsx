"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Button from '../../../general-components/button'
import nodePath from 'path'
import * as c from '../fs-write-constants'
import * as t from '../fs-write-actiontypes'
import * as FsWriteActions from '../fs-write-actions'

export default class WriteActionMove extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    let title = (this.props.action.get('task') == t.TASK_MOVE) ? 'Move' : 'Copy' 
    if(this.props.action.get('clobber')) title = title + ' and overwrite'
    
    return (
      <div className="action-copy">
        <div className="action-describe">
          {title}
          <b> {nodePath.basename(this.props.action.get('source'))}</b>{' to '} 
          <b>{nodePath.basename(nodePath.dirname(this.props.action.get('destination')))}</b>
        </div>
        {this.renderErrorMessage()}
        {this.renderConfirm()}
        {this.renderProgressing()}
      </div>
    )
  }

  renderErrorMessage = () => {
    if(this.props.action.getIn(['error', 'code'])) {
      console.log( this.props.action.getIn( ['error']).toJS() )

      let errorMessage, tryAgain = false
      switch (this.props.action.getIn( ['error', 'code'])) {
        case c.ERROR_NOT_EXISTS:
          errorMessage = "Source or target folder are not existing. How did you create that error?"
          break;
        
        case c.ERROR_NO_ACCESS:
          errorMessage = "I don't have the permission to do that."
          tryAgain = true
          break;
        
        case c.ERROR_RENAME_CROSS_DEVICE:
          errorMessage = "Can't rename from One device to an other. You should never see this Message. Else something is wrong with FileFlow."
          break;
        
        case c.ERROR_DEST_ALREADY_EXISTS:
          errorMessage = nodePath.basename(this.props.action.get('destination'))+" exists already. I can overwrite that for you, but that is maybe an bad idea?"
          break;
        
        case c.ERROR_MOVE_IN_IT_SELF:
          errorMessage = "How should I move a folder in to it self? Thats impossible..."
          break;
        
        default:
          errorMessage = "Error: code "+this.props.action.getIn(['error', 'code'])+'\n'+JSON.stringify(this.props.action.get('error'))
          break;
      }

      return  <div className="error-handling">
                <p className="error-message">{errorMessage}</p>
                {(tryAgain) ? this.renderTryAgain() : null}
              </div>
    } else {
      return null
    }
  }

  renderTryAgain = () => {
    return (
      <div className="error-actions">
        <Button className="try-again" text="Try Again" onClick={
          () => {
            FsWriteActions.startFsWorker(
              this.props.action.get('source'),
              this.props.action.get('destination'),
              {
                task: this.props.action.get('task'),
                clobber: this.props.action.get('clobber')
              },
              this.props.action.get('id')
            )
          }
        }/>
      </div>
    )
  }

  renderConfirm = () => {
    if(this.props.action.get('error') && this.props.action.getIn(['error', 'code']) == c.ERROR_DEST_ALREADY_EXISTS) {
      return  <div className="confirm">
                <Button text="Overwrite" onClick={
                  () => {
                    FsWriteActions.startFsWorker(
                      this.props.action.get('source'),
                      this.props.action.get('destination'),
                      {
                        task: this.props.action.get('task'), 
                        clobber: true
                      },
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
}
