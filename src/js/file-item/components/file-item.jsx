"use strict"
import {remote, Menu, MenuItem} from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import Icon from '../../general-components/icon'
import classNames from 'classnames'
import {Map} from 'immutable'
import _ from 'lodash'
import eventHandler from '../fi-event-handler/fi-event-handler-index'
import RenameInput from '../../filesystem/rename/components/rename-input'
import {dragndrop} from '../../utils/utils-index'
import { DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend';

const FolderDropTarget = {
  drop(props, monitor) {
    const hasDroppedOnChild = monitor.didDrop()
    if (hasDroppedOnChild) return
    
    if(monitor.getItem().files.length > 0) {
      let files = []
      _.forIn(monitor.getItem().files, function(value, key) {
        if(_.hasIn(value, 'path'))
        files.push(value.path)
      })

      console.log(files)

      // props.dispatch(Actions.addNavGroup(title, files))
    }
  },
  canDrop(props, monitor) {
    let allowed = true
    console.log(monitor.getItem().files)
    _.forIn(monitor.getItem().files, function(value, key) {
      if(dropFile.path == file.get('path')) {
      if(_.hasIn(value, 'path') && value.path == this.prop.file.get('path'))
        allowed = false // Drop on Itself
      }
    })
    return allowed
  }
}


function dropAllowed(event, file) {
  let allowed = true
  for (let dropFile of event.dataTransfer.files) {
    if(dropFile.path == file.get('path')) {
      allowed = false // Drop on Itself
    }
  }
  return allowed
}

@DropTarget(NativeTypes.FILE, FolderDropTarget, (connect, monitor) => ({
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDropTarget: connect.dropTarget(),
  // You can ask the monitor about the current drag state:
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType()
}))
export default class FileItemDisplay extends React.Component {

  constructor(props) {
    super(props)
    this.dragOverTimeout = null
    this.state = {
      data: Map({
        renaming: false,
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
    
    return this.props.connectDropTarget(
      <span
        className={classNames({
          'file-item': true,
          'edit': this.props.file.get('renaming'),
          'folder': this.props.file.get('stats').isDirectory(),
          'file': this.props.file.get('stats').isFile(),
          'active': this.props.file.get('active'),
          'selected': this.props.file.get('selected'),
          'drag-target': this.props.canDrop && this.props.isOverCurrent,
          'drag-blocked': !this.props.canDrop && this.props.isOverCurrent,
          'open-animation': this.state.data.get('openAnimation'),
          'progress': this.props.file.get('progress')
        })}
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
