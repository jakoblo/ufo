import React from 'react'
import classnames from 'classnames'
import nodePath from 'path'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Editor, Raw, Plain } from 'slate'
import * as FsMergedSelector from  '../../filesystem/fs-merged-selectors'
import * as c from  '../folder-editor-constants'
import * as Actions from  '../folder-editor-actions'
import Filter from '../../filesystem/filter/filter-index'
import FilePlugin from './slate-file-plugin'
import MarkdownPlugin from './slate-markdown-plugin'

@connect(() => {
  const getFiltedBaseArrayOfFolder = FsMergedSelector.getFiltedBaseArrayOfFolder_Factory()
  return (state, props) => {
    return {
      focused: Filter.selectors.isFocused(state, props.path),
      fileList: getFiltedBaseArrayOfFolder(state, props.path),
      editorState: state[c.NAME].get(props.path)
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
  }

  render() {
    return  (this.props.editorState) ?
        <Editor
          state={this.props.editorState}
          plugins={ [this.filePlugin, MarkdownPlugin({})] }
          onChange={this.onChange}
          onDocumentChange={this.onDocumentChange}
        />
      : 
        null
  }

  componentWillMount() {
    this.props.dispatch(
      Actions.folderEditorInit(this.props)
    )
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  onChange = (editorState) => {
    this.props.dispatch(
      Actions.folderEditorChange(this.props.path, editorState)
    )
  }

  onDocumentChange = (document, editorState) => {
    console.log("DOCUMENT onChange")
    // this.props.dispatch(
    //   Actions.mapFilesToEditor(nextProps)
    // )
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {
    this.props.dispatch(
      Actions.folderEditorClose(this.props.path)
    )
  }

}