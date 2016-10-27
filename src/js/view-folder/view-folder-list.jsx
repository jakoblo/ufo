import React from 'react'
import { connect } from 'react-redux'
import * as fsMergedSelectors from  '../filesystem/fs-merged-selectors'
import FileItem from '../file-item/components/file-item'
import classnames from 'classnames'
import {Map} from 'immutable'
import {dragndrop} from '../utils/utils-index'
import Button from '../general-components/button'
import fsWrite from '../filesystem/write/fs-write-index'
import Selection from '../filesystem/selection/sel-index'
import Filter from '../filesystem/filter/filter-index'

@connect(() => {
  const getFilesMerged = fsMergedSelectors.getFilesMergedOf_Factory()
  return (state, props) => {
    return {
      focused: Selection.selectors.isFocused(state, props), 
      files: getFilesMerged(state, props),
      filterUserInput: Filter.selectors.getUserInput(state, props)
    }
  }
})
export default class DisplayList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: Map({
        dropTarget: false
      })
    }
    this.dragInOutCount = 0
  }

  render() {
    let fileList = ""
    if(this.props.files) {
      fileList = this.props.files.valueSeq().map((file, index) => {
        return ( <FileItem
          key={index}
          file={file}
          dispatch={this.props.dispatch}
        /> )
      })
    }

    return(

        <div className={classnames({
            'display-list': true,
            'drag-target': this.state.data.get('dropTarget'),
            'focused': this.props.focused
          })}
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onMouseUp={this.focus}
        >
          {fileList}
          <Button text="new Folder" className="btn-new-folder" onClick={(e) => {
            event.preventDefault(); event.stopPropagation();
            this.props.dispatch( fsWrite.actions.newFolder(this.props.path) )
          }} />
          <Filter.components.filterUserInput path={this.props.path} />
        </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.files !== this.props.files || 
      nextProps.focused !== this.props.focused ||
      nextState.data !== this.state.data
    )
  }
  
  setImmState(fn) {
    // https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state
    return this.setState(({data}) => ({
      data: fn(data)
    }));
  }


  onDragOver = (event) => {
    event.preventDefault(); event.stopPropagation();
    event.dataTransfer.dropEffect = "copy"
    this.setImmState((prevState) => (prevState.set('dropTarget', true)))
  }

  onDragEnter = (event) => {
    event.preventDefault(); event.stopPropagation();
    this.dragInOutCount++
    this.setImmState((prevState) => (prevState.set('dropTarget', true)))
  }

  onDragLeave = (event) => {
    event.preventDefault(); event.stopPropagation();
    this.dragInOutCount--
    if(this.dragInOutCount < 1) {
      this.setImmState((prevState) => (prevState.set('dropTarget', false)))
    }
  }

  onDrop = (event) => {
    event.preventDefault(); event.stopPropagation();
    this.setImmState((prevState) => (prevState.set('dropTarget', false)))
    dragndrop.handleFileDrop(event, this.props.path)
  }

  focus = (event) => {
    this.props.dispatch( Selection.actions.dirSet(this.props.path) )
  }
}
