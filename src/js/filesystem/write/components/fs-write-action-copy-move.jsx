"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import * as c from '../fs-write-constants'
import * as t from '../fs-write-actiontypes'
import FsWriteActionItem from './fs-write-action-item'
import ProgressArrow from './fs-write-action-progress-arrow'
import ErrorMessages from './fs-write-action-error-messages'

export default class WriteActionMove extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    let title = (this.props.action.get('type') == t.TASK_MOVE) ? 'Move' : 'Copy' 
    if(this.props.action.get('clobber')) title = title + ' and overwrite'

    let sourceItems = []
    this.props.action.get('sources').forEach((source) => {
      sourceItems.push(<FsWriteActionItem type="source" key={source} path={source} />)
    })
    
    return (
      <div className="fs-write-action__container">

        <div className="fs-write-action__title">{title}</div>
        <div className="fs-write-action__content">
          <ProgressArrow
            className="fs-write-action__progress-arrow"
            sourceCount={this.props.action.get('sources').size} 
            progress={this.calcTotalProgress()}
            finished={this.props.action.get('finished')}
            error={(this.props.action.get('errors').size > 0)}
          />
          <div className="fs-write-action__item-container">
            {sourceItems}
            <FsWriteActionItem type="target" path={ this.props.action.get('target') } />
          </div>
        </div>
        <ErrorMessages action={this.props.action} />      
      </div>
    )
  }
  // {this.renderConfirm()}

  calcTotalProgress = () => {
    let totalProgress = 0
    let tasksDone = (this.props.action.get('sources').size - this.props.action.get('subTasks').size) * 100 
    this.props.action.get('subTasks').forEach((subTask) => {
      totalProgress = totalProgress + subTask.get('percentage')
    })
    return (totalProgress + tasksDone) / this.props.action.get('sources').size
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.action !== this.props.action // || nextState.data !== this.state.data;
  }
}
