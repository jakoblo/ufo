import React from 'react'
import classnames from 'classnames'
import nodePath from 'path'
import { connect } from 'react-redux'
import { Editor } from 'slate'
import * as FsMergedSelector from  '../../../filesystem/fs-merged-selectors'
import * as c from  '../folder-editor-constants'
import * as Actions from  '../folder-editor-actions'
import * as selectors from  '../folder-editor-selectors'
import Filter from '../../../filesystem/filter/filter-index'
import FilePlugin from '../plugins/slate-file-plugin'
import MarkdownPlugin from '../plugins/slate-markdown'
import Config from '../../../config/config-index'
import * as Utils from '../../../utils/utils-index'
import * as Helper from '../folder-editor-helper'

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
      folderPath: props.path,
      dispatch: this.props.dispatch
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
              onDocumentChange={this.onDocumentChange}
              onSelectionChange={this.onSelectionChange}
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

  onDocumentChange = (document, state) => {
    this.savingTimout = setTimeout(this.saveDocument, 1000)
  }

  savingTimout = null

  saveDocument = () => {
    this.savingTimout = setTimeout(() => {
      this.savingTimout = null
      const path = nodePath.join( this.props.path, 'index.md')
      const content = Helper.serializeMarkdown(this.props.editorState)
      Utils.fs.saveFile( path, content )
    }, 1000)
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {
    if(this.savingTimout) {
      clearTimeout(this.savingTimout)
      this.saveDocument()
    }
    this.props.dispatch(
      Actions.folderEditorClose(this.props.path)
    )
  }

}