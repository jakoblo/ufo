import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Editor, Raw, Plain } from 'slate'
import * as FsMergedSelector from  '../../../filesystem/fs-merged-selectors'
import * as c from  '../folder-editor-constants'
import * as Actions from  '../folder-editor-actions'
import * as selectors from  '../folder-editor-selectors'
import Filter from '../../../filesystem/filter/filter-index'
import FilePlugin from '../plugins/file/slate-file-plugin'
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
  }

  render() {
    return ( 
        <div className="view-folder__editor-container">
        {
          (this.props.editorState) ?
            <Editor
              state={this.props.editorState}
              className="slate-editor"
              plugins={ [this.filePlugin] }
              onChange={this.onChange}
              onDrop={this.onDrop}
              readOnly={this.props.readOnly}
              onBlur={() => {
                console.log('blur')
              }}
              onDocumentChange={this.onDocumentChange}
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
    this.props.dispatch(
      Actions.folderEditorChange(this.props.path, editorState)
    )
  }

  onDocumentChange = (document, editorState) => {
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