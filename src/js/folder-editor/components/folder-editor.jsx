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
import FilePlugin from '../plugins/file/slate-file-plugin'

import FilterTypeInput from '../../filesystem/filter/components/filter-type-input'
import fsWrite from '../../filesystem/write/fs-write-index'

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
    return ( 
      <div className={
          classnames({
            'folder-display-list': true,
            'folder-display-list--drop-target': this.props.isOverCurrent,
            'folder-display-list--focused': this.props.focused
          })
        }
      >
        <div className="folder-display-list__toolbar-top">
          <div className="folder-display-list__name">
            {nodePath.basename(this.props.path)}
          </div>
        </div>
        <div className="folder-display-list__editor-container">
        {
          (this.props.editorState) ?
            <Editor
              state={this.props.editorState}
              className="slate-editor"
              plugins={ [this.filePlugin] }
              onChange={this.onChange}
              onDrop={this.onDrop}
              /*ref={(e) => {this.editor = e}} */
              onBlur={() => {
                console.log('blur')
              }}
              onDocumentChange={this.onDocumentChange}
            />
          : 
            <div className="noFileActions">
              Loading...
            </div>
        }
        </div>
        <div className="folder-display-list__toolbar-bottom">
          <button
            className="folder-display-list__button-add-folder" 
            onClick={() => {
              this.props.dispatch( fsWrite.actions.newFolder(this.props.path) )
            }}
          />
          <FilterTypeInput path={this.props.path} />
        </div>
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