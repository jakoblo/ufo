import React from 'react'
import { connect } from 'react-redux'
import * as FsMergedSelector from  '../filesystem/fs-merged-selectors'
import FileItem from '../file-item/components/file-item'
import FilterTypeInput from '../filesystem/filter/components/filter-type-input'
import Filter from '../filesystem/filter/filter-index'
import App from '../app/app-index'
import classnames from 'classnames'
import _ from 'lodash'
import {Map} from 'immutable'
import Button from '../general-components/button'
import fsWrite from '../filesystem/write/fs-write-index'
import {dragndrop} from '../utils/utils-index'
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
  hover(props, monitor, e, b) {
    console.log(e, b)
  }
}


@connect(() => {
  const getFilesMergedOf = FsMergedSelector.getFilesMergedOf_Factory()
  return (state, props) => {
    return {
      focused: Filter.selectors.isFocused(state, props),
      folder: getFilesMergedOf(state, props)
    }
  }
})
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
export default class DisplayList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let fileList = ""
    if(this.props.folder) {
      fileList = this.props.folder.valueSeq().map((file, index) => {
        return ( <FileItem
          key={index}
          file={file}
          dispatch={this.props.dispatch}
        /> )
      })
    }

    return this.props.connectDropTarget(
      <div className={classnames({
        'display-list': true,
        'drag-target': this.props.isOverCurrent,
        'focused': this.props.focused
      })}
      >
        {fileList}
        <FilterTypeInput path={this.props.path} />
        <Button text="new Folder" onClick={() => {
          this.props.dispatch( fsWrite.actions.newFolder(this.props.path) )
        }} />
      </div>
    )
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   return (
  //     nextProps.folder !== this.props.folder || 
  //     nextProps.focused !== this.props.focused
  //   )
  // }
  
  setImmState(fn) {
    // https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state
    return this.setState(({data}) => ({
      data: fn(data)
    }));
  }


  // onDragOver = (event) => {
  //   event.preventDefault()
  //   event.stopPropagation()
  //   event.dataTransfer.dropEffect = "copy"
  //   this.setImmState((prevState) => (prevState.set('dropTarget', true)))
  // }

  // onDragEnter = (event) => {
  //   event.preventDefault()
  //   event.stopPropagation()
  //   this.dragInOutCount++
  //   this.setImmState((prevState) => (prevState.set('dropTarget', true)))
  // }

  // onDragLeave = (event) => {
  //   event.preventDefault()
  //   event.stopPropagation()
  //   this.dragInOutCount--
  //   if(this.dragInOutCount < 1) {
  //     this.setImmState((prevState) => (prevState.set('dropTarget', false)))
  //   }
  // }

  // onDrop = (event) => {
  //   event.preventDefault()
  //   event.stopPropagation()
  //   this.setImmState((prevState) => (prevState.set('dropTarget', false)))
  //   dragndrop.handleFileDrop(event, this.props.path)
  // }
  
  focus = (event) => {
    console.log('Fix folder')
    this.props.dispatch( App.actions.changeAppPath(null, this.props.path) )
  }
}
