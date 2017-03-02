"use strict"
import {remote, Menu, MenuItem} from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import Icon from '../../general-components/icon'
import classNames from 'classnames'
import {Map} from 'immutable'
import _ from 'lodash'
import RenameInput from '../../filesystem/rename/components/rename-input'
import ProgressPie from '../../general-components/progress-pie'
import FileItemUnkown from './file-item-unknown'
import * as DnD from '../../utils/dragndrop'
import * as FileActions from '../fi-actions'

import * as FsMergedSelector from  '../../filesystem/fs-merged-selectors'

@connect(() => {

  const getFile = FsMergedSelector.getFile_Factory()

  return (state, props) => {
    const file = getFile(state, props.path)

    return {
      file: file
    }
  }
})
export default class FileItemComp extends React.Component {

  constructor(props) {
    super(props)
    this.dragOverTimeout = null
    this.setDropHover = (event, cursorPosition) => {
      this.setImmState((prevState) => (prevState.set('dropTarget', cursorPosition)))
    }
    this.state = {
      data: Map({
        openAnimation: false,
        dropTarget: false
      })
    }
  }

  render() {
    if(this.props.file.get('type') == "unknown") {
      return <FileItemUnkown className={this.props.className} />
    }

    return(
      <div
        className={classNames({
          [this.props.className]: true,
          [this.props.className+'--renaming']: this.props.file.get('renaming'),
          [this.props.className+'--theme-folder']: this.props.file.get('stats').isDirectory(),
          [this.props.className+'--theme-file']: this.props.file.get('stats').isFile(),
          [this.props.className+'--active']: this.props.file.get('active'),
          [this.props.className+'--selected']: this.props.file.get('selected'),
          [this.props.className+'--is-focused']: this.props.isFocused,
          [this.props.className+'--drop-target']: (this.props.file.get('stats').isDirectory() && this.state.data.get('dropTarget') == DnD.constants.CURSOR_POSITION_TOP),
          [this.props.className+'--drop-target-top']: (this.state.data.get('dropTarget') == DnD.constants.CURSOR_POSITION_TOP),
          [this.props.className+'--drop-target-bottom']: (this.state.data.get('dropTarget') == DnD.constants.CURSOR_POSITION_BOTTOM),
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
            {...this.enhancedDropZoneListener}
          />
        }
      </div>
      )
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
      nextProps.isFocused !== this.props.isFocused || 
      nextState.data !== this.state.data
    );
  }

  onDragStart = (event) => {
    event.preventDefault()
    if(!this.props.file.get('progress')) {
      this.props.dispatch( FileActions.startDrag(this.props.file) )
    }
  }

  enhancedDropZoneListener = DnD.getEnhancedDropZoneListener({
    acceptableTypes: [DnD.constants.TYPE_FILE],
    possibleEffects: DnD.constants.effects.COPY_MOVE,

    dragHover: (event, cursorPosition)  => {
      this.startPeakTimeout()
      this.setDropHover(event, cursorPosition) 
    },

    dragOut: (event, cursorPosition)  => {
      this.cancelPeakTimeout()
      this.setDropHover(event, cursorPosition)
    },

    drop: (event, cursorPosition) => {
      if(this.props.onDrop) {
        this.props.onDrop(event, cursorPosition)
      }
    }
  })

  startPeakTimeout = () => {
    if(this.props.file.get('stats').isDirectory() && this.dragOverTimeout == null) {
      this.dragOverTimeout = setTimeout(() => {
        this.props.dispatch( FileActions.show(this.props.file) )
      }, 1000)
    }
  }

  cancelPeakTimeout = () => {
    clearTimeout(this.dragOverTimeout)
    this.dragOverTimeout = null
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
