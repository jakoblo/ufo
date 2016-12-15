import React from 'react'
import { connect } from 'react-redux'
import * as FsMergedSelector from  '../filesystem/fs-merged-selectors'
import FileItem from '../file-item/components/file-item'
import FilterTypeInput from '../filesystem/filter/components/filter-type-input'
import Filter from '../filesystem/filter/filter-index'
import nodePath from 'path'
import {components} from '../file-item/fi-index'
import classnames from 'classnames'
import {Map} from 'immutable'
import {dragndrop} from '../utils/utils-index'
import {AtomicBlockUtils,
        Editor,
        EditorState,
        RichUtils,
        convertToRaw, Entity, Modifier} from 'draft-js'

const FILE_BLOCK = "FILE_BLOCK"

@connect(() => {
  const getFilesMergedOf = FsMergedSelector.getFilesMergedOf_Factory()
  return (state, props) => {
    return {
      focused: Filter.selectors.isFocused(state, props),
      folder: getFilesMergedOf(state, props)
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
    
    this.dragInOutCount = 0
  }

  componentWillReceiveProps(nextProps) {
    this.loadEditorContent(nextProps)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.folder !== this.props.folder || 
      nextProps.focused !== this.props.focused || 
      nextProps.ready !== this.props.ready || 
      nextState.data !== this.state.data ||
      nextState.editorState !== this.state.editorState
      )
  }

  render() {
    // console.log("FOLDER", this.props.folder)
    // return <Editor editorState={this.state.editorState} onChange={this.onChange} />
    return(
      <div className={
          classnames({
             // change to .folder-display-editor
            'folder-display-list': true,
            'folder-display-list--drop-target': this.state.data.get('dropTarget'),
            'folder-display-list--focused': this.props.focused
          })
        }
        onKeyDown={this.onKeyDown}
        >
        <div className="folder-display-list__toolbar-top">
          <div className="folder-display-list__name">
            {nodePath.basename(this.props.path)}
          </div>
        </div>
        <div className="folder-display-list__item-container">
          <Editor 
            editorState={this.state.editorState}
            blockRendererFn={this.getBlockRendererFn} 
            onChange={this.onChange} 
            blockStyleFn={this.getBlockStyleFn}
            onDrop={this.onDrop}
            onDragOver={this.onDragOver}
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave}
          />
        </div>
        <div className="folder-display-list__toolbar-bottom">
          <button
            className="folder-display-list__button-add-folder" 
            onClick={() => {
              this.props.dispatch( fsWrite.actions.newFolder(this.props.path) )
            }}
          />
        </div>
      </div>
    )
  }

  onChange = (editorState) => {
    this.setState({editorState})
  }

  onKeyDown = (event) => {
    event.stopPropagation()
  }

  loadEditorContent(nextProps) {
  
  // console.log(this.props.folder)
  let newEditorState = EditorState.createEmpty()
  
  if(nextProps.folder) {
    console.log("FOLDER")
        
    nextProps.folder.valueSeq().forEach((file, index) => {
    const entityKey = Entity.create(
      FILE_BLOCK,
      'IMMUTABLE',
      {key: index, file: file, dispatch: this.props.dispatch}
    )

    newEditorState = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');

  })
    this.onChange(newEditorState)
  }
}

  getBlockRendererFn(contentBlock) {
    const type = contentBlock.getType()
    switch(type) {
        case "atomic":
          const entity = Entity.get(contentBlock.getEntityAt(0))
          const type = entity.getType()
          if (type === FILE_BLOCK) {
            return {
                component: FileWrapper,
                editable: false
                // props: {
                //     getEditorState,
                //     onChange,
                // }
            }
          } else {
            return null
          }
        default:
            return null
    }
  }

  getBlockStyleFn(contentBlock) {
    switch (contentBlock.getType()) {
       case "atomic":
          const entity = Entity.get(contentBlock.getEntityAt(0))
          const type = entity.getType()
          if (type === FILE_BLOCK) 
            return 'display-editor'
      default:
        return '';
    }
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

const FileWrapper = (props) => {
  const data = Entity.get(props.block.getEntityAt(0)).getData()
  const {key} = data
  const {file} = data
  const {dispatch} = data

//   props.blockProps
  let item = <FileItem
    key={key}
    file={file}
    className="folder-list-item" // Should be changed to folder-editor-item
    dispatch={dispatch}
  />


  return item
};