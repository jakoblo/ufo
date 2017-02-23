/**
 * 
 * SLATE JS EXPERIMENT
 * https://github.com/ianstormtaylor/slate
 * 
 */

import React from 'react'
import FileItem from '../../file-item/components/file-item'
import classnames from 'classnames'
import nodePath from 'path'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Editor, Raw, Plain } from 'slate'
import * as FsMergedSelector from  '../../filesystem/fs-merged-selectors'
import * as c from  '../folder-editor-constants'
import * as Actions from  '../folder-editor-actions'
import Filter from '../../filesystem/filter/filter-index'

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
  }

  render() {
    return  (this.props.editorState) ?
        <Editor
          state={this.props.editorState}
          schema={this.schema}
          onChange={this.onChange}
          onBeforeInput={this.onBeforeInput}
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
  
  onBeforeInput = (event, data, state) => {
    if(this.selectionIsOnFile(state)) {
      return this.insetLineAboveFileBlock(state)
    }
  }

  // https://docs.slatejs.org/reference/models/schema.html
  schema = {
    nodes: {
      // Render FileItems in blocks with type file
      file: (editorProps) => {
        const { node, state } = editorProps
        const isFocused = state.selection.hasEdgeIn(node)
        const base = node.data.get('base')
        return (
          <FileItem
            className='folder-list-item'
            isFocused={isFocused}
            path={nodePath.join(this.props.path, base)}
            dispatch={this.props.dispatch}
          />
        )
      }
    }
  }

  selectionIsOnFile = (state) => state.blocks.some(block => block.type == 'file')

  /**
   * | FileItem |
   * | FileItem | < selection
   * 
   * will transform to:
   * 
   * | FileItem |
   * |            < new Empty Text line
   * | FileItem |
   * 
   * @param {State} editorState
   */
  insetLineAboveFileBlock = (editorState) => {
    return editorState
      .transform()
      .splitBlock()
      .setBlock({
        type: 'paragraph',
        isVoid: false,
        data: {}
      })
      .apply()
  }

}