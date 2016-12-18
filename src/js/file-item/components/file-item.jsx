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
import ProgressPie from '../../general-components/progress-pie'
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

export default class FileItemComp extends React.Component {


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

    if(!this.props.file.get('stats')) {
      console.log(this.props.file.toJS())
    }


    return (
      <div
        className={classNames({
          [this.props.className]: true,
          [this.props.className+'--renaming']: this.props.file.get('renaming'),
          [this.props.className+'--theme-folder']: this.props.file.get('stats').isDirectory(),
          [this.props.className+'--theme-file']: this.props.file.get('stats').isFile(),
          [this.props.className+'--active']: this.props.file.get('active'),
          [this.props.className+'--selected']: this.props.file.get('selected'),
          [this.props.className+'--drop-target']: this.props.canDrop && this.props.isOverCurrent,
          [this.props.className+'--drop-blocked']: !this.props.canDrop && this.props.isOverCurrent,
          [this.props.className+'--open-animation']: this.state.data.get('openAnimation'),
          [this.props.className+'--in-progress']: this.props.file.get('progress')
        })}
      >
        <div className={this.props.className+'__underlay'} />
        {this.props.file.get('progress') ? 
          <ProgressPie
            className={this.props.className+'__progress-pie'}
            progress={this.props.file.get('progress')}
            size={16}
          />
        : null }
        <div className={this.props.className+'__name-base'} >{this.props.file.get('name')}</div>
        <div className={this.props.className+'__name-suffix'} >{this.props.file.get('suffix')}</div>
        {this.props.file.get('renaming') ? 
          <RenameInput
            className={this.props.className+'__rename-input'}
            path={this.props.file.get('path')}
            dispatch={this.props.dispatch}
          />
        : null}
        <div className={this.props.className+'__event-catcher'} 
          draggable={true}
          {...this.clickHandler}
          {...this.dragndropHandler}
        />
      </div>
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
