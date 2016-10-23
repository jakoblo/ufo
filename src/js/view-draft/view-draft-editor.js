import React from 'react'
import { connect } from 'react-redux'
import * as FsCombinedSelector from  '../filesystem/fs-combined-selectors'
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
    this.onChange = (editorState) => { this.setState({editorState}) }
    this.dragInOutCount = 0
    
  }

  componentWillReceiveProps(nextProps) {
    this.loadEditorContent(nextProps)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.folder !== this.props.folder || nextState.data !== this.state.data;
  }

  render() {
    
    // console.log("FOLDER", this.props.folder)
    // return <Editor editorState={this.state.editorState} onChange={this.onChange} />
    return(
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
    )
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
      case FILE_BLOCK:
        return 'block';
      default:
        return 'block';
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
  let item = <components.fileItem
    key={key}
    file={file}
    dispatch={dispatch}
  />


  return item
};