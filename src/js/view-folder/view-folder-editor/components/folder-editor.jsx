import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Editor, Raw, Plain } from 'slate'
import * as FsMergedSelector from  '../../../filesystem/fs-merged-selectors'
import * as c from  '../folder-editor-constants'
import * as Actions from  '../folder-editor-actions'
import * as selectors from  '../folder-editor-selectors'
import Filter from '../../../filesystem/filter/filter-index'
import FilePlugin from '../plugins/slate-file-plugin'
import MarkdownPlugin from '../plugins/slate-markdown'
import Config from '../../../config/config-index'

import Loading from '../../../general-components/loading'

@connect(() => {
  const getFiltedBaseArrayOfFolder = FsMergedSelector.getFiltedBaseArrayOfFolder_Factory()
  return (state, props) => {
    return {
      focused: Filter.selectors.isFocused(state, props.path),
      fileList: getFiltedBaseArrayOfFolder(state, props.path),
      editorState: selectors.getEditorState(state, props.path),
      readOnly: Config.selectors.getReadOnlyState(state)
    }
  }
})
export default class FolderEditor extends React.Component {

  constructor(props) {
    super(props)
    this.filePlugin = FilePlugin({
      BLOCK_TYPE: c.BLOCK_TYPE_FILE,
      folderPath: props.path
    })
    this.markdownPlugin = MarkdownPlugin()
  }

  render() {
    return ( 
        <div className="view-folder__editor-container">
        {
          (this.props.editorState) ?
            <Editor
              state={this.props.editorState}
              className="slate-editor"
              plugins={ [this.filePlugin, this.markdownPlugin] }
              onChange={this.onChange}
              onDrop={this.onDrop}
              readOnly={this.props.readOnly}
              onBeforeChange={this.onBeforeChange}
            />
          : 
            <Loading />
        }
        </div>
    )
  }
  
  stopEvent (e) {
    console.log('stop')
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"
  }

  componentDidMount() {
    this.props.dispatch(
      Actions.folderEditorInit(this.props)
    )
  }

  onChange = (editorState) => {
    // console.log('external onchange')
    this.props.dispatch(
      Actions.folderEditorChange(this.props.path, editorState)
    )
  }

  // onBeforeChange = (state) => {
  //   const selection = state.get('selection')
  //   const document = state.get('document')
  //   const blocks = document.getBlocksAtRange(selection)

  //   let transforming = state.transform()
    
  //   const block = blocks.first() 
  //   const newBlock = this.blockDecortor( blocks.first() )
  //   // blocks.forEach((block) => {
      
  //     if(block != newBlock) { 
  //       transforming = transforming.setNodeByKey(block.key, newBlock)
  //     }
  //   // })

  //   return transforming.apply()
  // }

  // blockDecortor = (block) => {

  //   if(block.isVoid) return block

  //   const text = block.text

  //   // #headline 
  //   if(text.match(/^(#+)(.*)/g)) {
  //     let headlineDept = text.match(/^(#+)/g)[0].length
  //     if(headlineDept > 6) headlineDept = 6
  //     let newBlockType = 'h'+headlineDept
  //     return block.set('type', newBlockType)
  //   }

  //   if(block.get('type') != "paragraph") {
  //     return block.set('type', 'paragraph')
  //   }
  // }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {
    this.props.dispatch(
      Actions.folderEditorClose(this.props.path)
    )
  }

}