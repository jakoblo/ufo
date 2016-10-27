"use strict"
import {remote, Menu, MenuItem} from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import Icon from '../../general-components/icon'
import classNames from 'classnames'
import {Map} from 'immutable'
import eventHandler from '../fi-event-handler/fi-event-handler-index'
import RenameInput from '../../filesystem/rename/components/rename-input'

export default class FileItemDisplay extends React.Component {

  constructor(props) {
    super(props)
    this.dragOverTimeout = null
    this.state = {
      data: Map({
        renaming: false,
        dropTarget: false,
        dropBlocked: false,
        openAnimation: false
      })
    }
    this.clickHandler = eventHandler.getClick(this)
    this.dragndropHandler = eventHandler.getDragnDrop(this)
    this.renameHandler = eventHandler.getRename(this)
  }

  render() {
    let progress, renameInput = null
    if(this.props.file.get('progress')) {
      progress = <div className="progress-bar">
                   <progress max="100" value={this.props.file.get('progress').get('percentage')}></progress>
                 </div>
    }

    if(this.props.file.get('renaming')) {
      renameInput = <RenameInput 
        path={this.props.file.get('path')}
        dispatch={this.props.dispatch}
      />
    }
    
    return (
      <span
        className={classNames({
          'file-item': true,
          'edit': this.props.file.get('renaming'),
          'folder': this.props.file.get('stats').isDirectory(),
          'file': this.props.file.get('stats').isFile(),
          'active': this.props.file.get('active'),
          'selected': this.props.file.get('selected'),
          'drag-target': this.state.data.get('dropTarget'),
          'drag-blocked': this.state.data.get('dropBlocked'),
          'open-animation': this.state.data.get('openAnimation'),
          'progress': this.props.file.get('progress')
        })}
        ref="file"
      >
        <span className="flex-box">
          <Icon glyph={classNames({
            'folder': this.props.file.get('stats').isDirectory(),
            'file': this.props.file.get('stats').isFile()
          })}/>
          <label>
            <span className="base">{this.props.file.get('name')}</span>
            <span className="suffix">{this.props.file.get('suffix')}</span>
          </label>
          {renameInput}
        </span>
        {progress}
        <span className="eventCatcher" 
          draggable={true}
          {...this.clickHandler}
          {...this.dragndropHandler}
        />
      </span>
    )
  }

  setImmState(fn) {
    // https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state
    return this.setState(({data}) => ({
      data: fn(data)
    }));
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.file !== this.props.file || nextState.data !== this.state.data;
  }
}
