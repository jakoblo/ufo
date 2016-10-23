import React from 'react'
import { connect } from 'react-redux'
import * as FsCombinedSelector from  '../filesystem/fs-combined-selectors'
import FileItem from '../file-item/fi-component-draft'
import classnames from 'classnames'
import {Map} from 'immutable'
import {dragndrop} from '../utils/utils-index'
import {AtomicBlockUtils,
        Editor,
        EditorState,
        RichUtils,
        convertToRaw, Entity, Modifier} from 'draft-js'



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

 

  render() {
    
    // console.log("FOLDER", this.props.folder)
    // return <Editor editorState={this.state.editorState} onChange={this.onChange} />
    return(
      <Editor 
        editorState={this.state.editorState}
        blockRendererFn={this.fileBlockRenderer} 
        onChange={this.onChange} 
        blockStyleFn={this.myBlockStyleFn}
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
      'file',
      'IMMUTABLE',
      {key: index, file: file, dispatch: this.props.dispatch}
      )

      newEditorState = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');

    })
      
    this.setState({
     editorState: newEditorState
    })

    }
  }

  

  fileBlockRenderer(contentBlock) {
    const type = contentBlock.getType()
    // console.log(type)
    if (type === 'atomic') {
      return {
        component: Media,
        editable: false
      }
    }
  }

  myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      return 'superFancyBlockquote';
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("RECEIVE")

    this.loadEditorContent(nextProps)
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log("SHOULD")
    // if(nextProps.folder !== this.props.folder)
    
    

    return true
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

      const Media = (props) => {
        console.log(props.blockProps)
        // console.log(props)
        // const entity = props.contentState.getEntity(
        //   props.block.getEntityAt(0)
        // );
        // // const {src} = entity.getData();
        // const type = entity.getType();

        // let media;
        // if (type === 'audio') {
        //   media = <Audio src={src} />;
        // } else if (type === 'image') {
        //   media = <Image src={src} />;
        // } else if (type === 'video') {
        //   media = <Video src={src} />;
        // }
        const data = Entity.get(props.block.getEntityAt(0)).getData()
        const {key} = data
        const {file} = data
        const {dispatch} = data
        console.log(data)

      //   props.blockProps
       let item = <FileItem
          key={key}
          file={file}
          dispatch={dispatch}
        />


        return item
      };