"use strict"
import {remote, Menu, MenuItem} from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import Icon from '../../general-components/icon'
import classNames from 'classnames'
import {Map} from 'immutable'
import _ from 'lodash'
import RenameInput from '../../filesystem/rename/components/rename-input'
import ProgressPie from '../../general-components/progress-pie'
import {dragndrop} from '../../utils/utils-index'
import { DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend';
import * as FileActions from '../fi-actions'

const FolderDropTarget = {
  // reactDnD drop not useable
  // No modifer keys available  
  // https://github.com/gaearon/react-dnd/issues/512
}
@DropTarget(NativeTypes.FILE, FolderDropTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
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
  }

  render() {
    const connectDropTarget = (this.props.file.get('stats').isDirectory()) ? this.props.connectDropTarget : r => r

    return connectDropTarget(
      <div
        className={classNames({
          [this.props.className]: true,
          [this.props.className+'--renaming']: this.props.file.get('renaming'),
          [this.props.className+'--theme-folder']: this.props.file.get('stats').isDirectory(),
          [this.props.className+'--theme-file']: this.props.file.get('stats').isFile(),
          [this.props.className+'--active']: this.props.file.get('active'),
          [this.props.className+'--selected']: this.props.file.get('selected'),
          [this.props.className+'--drop-target']: this.props.isOver,
          [this.props.className+'--open-animation']: this.state.data.get('openAnimation'),
          [this.props.className+'--in-progress']: this.props.file.get('progress')
        })}
        style={this.props.style}
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
        : 
          <div className={this.props.className+'__event-catcher'} 
            draggable={true}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onDoubleClick={this.onDoubleClick}
            onContextMenu={this.onContextMenu}
            onDragStart={this.onDragStart}
            onDrop={(e) => {
              if(this.props.file.get('stats').isDirectory()) {
                dragndrop.handleFileDrop(e, this.props.file.get('path'))}
              }
            }
          />
        }
      </div>)
  }

  setImmState(fn) {
    // https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state
    return this.setState(({data}) => ({
      data: fn(data)
    }));
  }

  componentWillReceiveProps = (nextProps) => {
    if (!this.props.isOver && nextProps.isOver) {
      // You can use this as enter handler
      this.dragOverTimeout = setTimeout(() => {
        this.props.dispatch( FileActions.show(this.props.file) )
      }, 1000)
    }
    if (this.props.isOver && !nextProps.isOver) {
      // You can use this as leave handler
      clearTimeout(this.dragOverTimeout)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.file !== this.props.file || 
      nextProps.isOver !== this.props.isOver || 
      nextProps.isOverCurrent !== this.props.isOverCurrent || 
      nextState.data !== this.state.data
    );
  }

  onDragStart = (event) => {
    event.preventDefault()
    if(!this.props.file.get('progress')) {
      this.props.dispatch( FileActions.startDrag(this.props.file) )
    }
  }

  /**
   * Adding file to Selection
   */
  onMouseDown = (event) => {
    event.stopPropagation()
    if(!this.props.file.get('progress')) {
      if(event.ctrlKey || event.metaKey) {
        this.props.dispatch( FileActions.addToSelection(this.props.file) )
      } else if(event.shiftKey) {
        this.props.dispatch( FileActions.expandSelection(this.props.file) )
      }
    }
  }

  /**
   * Show Folder or File in Preview
   */
  onMouseUp = (event) => {
    event.stopPropagation()
    if(!this.props.file.get('progress')) {
      if(!event.ctrlKey && !event.metaKey && !event.shiftKey) {
        if(!this.props.file.get('selected')) {
          this.props.dispatch( FileActions.show(this.props.file) )
        }
      }
    }
  }

  /**
   * Open File in Default Application
   */
  onDoubleClick = (event) => {
    if(!this.props.file.get('progress') && this.props.file.get('stats').isFile()) {
      // Open
      this.props.dispatch( FileActions.open(this.props.file) )

      this.setImmState((prevState) => (prevState.set('openAnimation', true)))
      setTimeout(() => {
        this.setImmState((prevState) => (prevState.set('openAnimation', false)))
      }, 1000);
    }
  }

  /**
   * Right Click menu
   */
  onContextMenu = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if(!this.props.file.get('progress')) {
      this.props.dispatch( 
        FileActions.showContextMenu(
          this.props.file,
          this.renameStart
        ))
    }
  }
}
