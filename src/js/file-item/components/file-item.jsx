"use strict"
import {remote, Menu, MenuItem} from 'electron'
const {app} = remote
import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import classNames from 'classnames'
import {Map} from 'immutable'
import RenameInput from '../../filesystem/rename/components/rename-input'
import ProgressPie from '../../general-components/progress-pie'
import FileItemUnkown from './file-item-unknown'
import * as DnD from '../../utils/dragndrop'
import * as FileActions from '../fi-actions'

import * as FsMergedSelector from  '../../filesystem/fs-merged-selectors'

@connect(() => {
  const getFile = FsMergedSelector.getFile_Factory()
  return (state, props) => {
    return {
      file: getFile(state, props.path)
    }
  }
})
export default class FileItemComp extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: Map({
        openAnimation: false,
        dropTarget: false,
        renaming: false,
        openAnimation: false,
        icon: null
      })
    }
    this.requestIcon(this.props.file.get('path'))
  }

  render() {

    const {className, file, isFocused} = this.props
    const immState = this.state.data

    if(file.get('type') == "unknown") {
      return <FileItemUnkown className={className} />
    }

    return(
      <div
        className={classNames({
          [className]: true,
          [className+'--renaming']: file.get('renaming'),
          [className+'--theme-folder']: file.get('stats').isDirectory(),
          [className+'--theme-file']: file.get('stats').isFile(),
          [className+'--active']: file.get('active'),
          [className+'--selected']: file.get('selected'),
          [className+'--is-focused']: isFocused,
          [className+'--drop-target']: file.get('stats').isDirectory() && immState.get('dropTarget'),
          [className+'--drop-target-top']: (immState.get('dropTarget') == DnD.constants.CURSOR_POSITION_TOP),
          [className+'--drop-target-bottom']: (immState.get('dropTarget') == DnD.constants.CURSOR_POSITION_BOTTOM),
          [className+'--open-animation']: immState.get('openAnimation'),
          [className+'--in-progress']: file.get('progress')
        })}
      >
        <div className={className+'__underlay'} />

        {file.get('progress') ? 
          <ProgressPie
            className={className+'__progress-pie'}
            progress={file.get('progress')}
            size={16}
          />
        :
          <div className={className+'__icon'} 
            style={
              (immState.get('icon')) ? 
                {backgroundImage: 'url("'+immState.get('icon') + '")' }
              : 
                null
            }
          />
        }

        <div className={className+'__name-base'} >{file.get('name')}</div>
        <div className={className+'__name-suffix'} >{file.get('suffix')}</div>
        {file.get('renaming') ? 
          <RenameInput
            className={className+'__rename-input'}
            path={file.get('path')}
            dispatch={this.props.dispatch}
          />
        : 
          <div className={className+'__event-catcher'} 
            draggable={true}
            onDragStart={this.onDragStart}
            onClick={this.onClick}
            onContextMenu={this.onContextMenu}
            onDoubleClick={this.onDoubleClick}
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
    if(this.props.file != nextProps.file) {
      this.requestIcon(nextProps.file.get('path'))
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.file !== this.props.file || 
      nextProps.isOver !== this.props.isOver || 
      nextProps.isOverCurrent !== this.props.isOverCurrent || 
      nextProps.isFocused !== this.props.isFocused || 
      nextProps.isCursor !== this.props.isCursor || 
      nextProps.cursorLeft !== this.props.cursorLeft || 
      nextProps.cursorRigth !== this.props.cursorRigth || 
      nextState.data !== this.state.data
    );
  }

  requestIcon = (path) => {
    if(this.props.file && this.props.file.get('stats') && this.props.file.get('stats').isFile()) {
      app.getFileIcon(path, {size: 'small'}, (error, image) => {
        if(!error) {
          this.setImmState((prevState) => (prevState.set('icon', 'data:image/png;base64,' + image.toPNG().toString('base64'))))
        }
      })
    }
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
      this.setImmState((prevState) => (prevState.set('dropTarget', cursorPosition)))
    },

    dragOut: (event)  => {
      this.cancelPeakTimeout()
      this.setImmState((prevState) => (prevState.set('dropTarget', false)))
    },

    drop: (event, cursorPosition) => {
      if(this.props.onDrop) {
        this.props.onDrop(event, cursorPosition)
      }
    }
  })

  dragOverTimeout = null

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

  // Adding file to Selection
  // onMouseDown = (event) => {
  //   // event.stopPropagation()
  //   // event.preventDefault()
  //   if(!this.props.file.get('progress')) {
  //     if(event.ctrlKey || event.metaKey) {
  //       this.props.onCtrlMetaClick(this.props.file.get('base'), this.props.file)
  //       // this.props.dispatch( FileActions.addToSelection(this.props.file) )
  //     } else if(event.shiftKey) {
  //       // this.props.dispatch( FileActions.expandSelection(this.props.file) )
  //       this.props.onShiftClick(this.props.file.get('base'), this.props.file)
  //     } else {
  //       // Wait for mouse up
  //     }
  //   }
  // }

  //Show Folder or File in Preview
  onClick = (event) => {
    // event.stopPropagation()
    if(!this.props.file.get('progress')) {
      if(!event.ctrlKey && !event.metaKey && !event.shiftKey) {
        // if(!this.props.file.get('selected')) {
          this.props.dispatch( FileActions.show(this.props.file) )
        // }
      }
    }
  }

  //Open File in Default Application
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

  //Right Click menu
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
