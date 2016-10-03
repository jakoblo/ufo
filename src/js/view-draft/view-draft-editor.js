import React from 'react'
import { connect } from 'react-redux'
import * as FsCombinedSelector from  '../filesystem/fs-combined-selectors'
import FileItem from '../file-item/fi-component'
import classnames from 'classnames'
import {Map} from 'immutable'
import {dragndrop} from '../utils/utils-index'
import {Editor, EditorState} from 'draft-js'



@connect(() => {
  const getFolderCombined = FsCombinedSelector.getFolderCombinedFactory()
  return (state, props) => {
    return {
      folder: getFolderCombined(state, props)
    }
  }
})
export default class DraftEditor extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      data: Map({
        dropTarget: false
      }),
      editorState: EditorState.createEmpty()
    }
    this.onChange = (editorState) => this.setState({editorState})
    this.dragInOutCount = 0
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
    
    return(
      <Editor 
        editorState={this.state.editorState} 
        onChange={this.onChange} 
        className={classnames({
          'display-list': true,
          'drag-target': this.state.data.get('dropTarget')
        })}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      />
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.folder !== this.props.folder || nextState.data !== this.state.data;
  }
  
  setImmState(fn) {
    // https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state
    return this.setState(({data}) => ({
      data: fn(data)
    }));
  }


  onDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = "copy"
    this.setImmState((prevState) => (prevState.set('dropTarget', true)))
  }

  onDragEnter = (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.dragInOutCount++
    this.setImmState((prevState) => (prevState.set('dropTarget', true)))
  }

  onDragLeave = (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.dragInOutCount--
    if(this.dragInOutCount < 1) {
      this.setImmState((prevState) => (prevState.set('dropTarget', false)))
    }
  }

  onDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.setImmState((prevState) => (prevState.set('dropTarget', false)))
    dragndrop.handleFileDrop(event, this.props.path)
  }
}
