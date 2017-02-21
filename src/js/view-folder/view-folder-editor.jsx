/**
 * 
 * SLATE JS EXPERIMENT
 * https://github.com/ianstormtaylor/slate
 * 
 */

import React from 'react'
import FileItem from '../file-item/components/file-item'
import classnames from 'classnames'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Editor, Raw, Plain } from 'slate'
import * as FsMergedSelector from  '../filesystem/fs-merged-selectors'
import Filter from '../filesystem/filter/filter-index'

@connect(() => {
  const getFilesMergedOf = FsMergedSelector.getFilesMergedOf_Factory()
  return (state, props) => {
    return {
      focused: Filter.selectors.isFocused(state, props),
      folder: getFilesMergedOf(state, props)
    }
  }
})
export default class FolderEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        editorState: Raw.deserialize({
          nodes: [
            {
              kind: 'block',
              type: 'paragraph',
              nodes: [
                {
                  kind: 'text',
                  text: 'Empty'
                }
              ]
            }
          ]
        }, { terse: true })
    }
  }

  render() {
    return (
      <Editor
        state={this.state.editorState}
        schema={this.schema}
        onChange={this.onChange}
        onBeforeInput={this.onBeforeInput}
        onDocumentChange={this.onDocumentChange}
      />
    )
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.ready == false && nextProps.ready == true) {
      this.mapFilesToEditor(this.state.editorState, nextProps)
    }
  }

  onChange = (editorState) => {
    this.setState({ editorState })
  }

  onDocumentChange = (document, editorState) => {
    this.mapFilesToEditor(editorState, this.props)
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
        if(this.props.folder) {
          return (
            <FileItem
              file={this.props.folder.get(base)}
              className='folder-list-item'
              isFocused={isFocused}
              dispatch={this.props.dispatch}
            />
          )
        }
      }
    }
  }

  /**
   * Will create file blocks for each file 
   * which is in the props.folder and not jet in the Editor
   * 
   * @param {State} editorState
   * @param {Props} props
   */
  mapFilesToEditor(editorState, props) {

    console.log('map')

    const filesInEditor = this.getFilesInEditor(editorState).toJS()
    const filesOnDisk = props.folder.keySeq().toJS()

    const filesNotInEditor = _.difference(filesOnDisk, filesInEditor)

    if(filesNotInEditor.length > 0) {
      filesNotInEditor.forEach((base, index) => {
        editorState = this.insertFile(editorState, base)
      })

      this.onChange(editorState)
    }
  }

  
  /**
   * Returs the Filenames which are currently as file blocks in the document
   * 
   * @param {State} editorState
   * @returns {Array} bases/filenames
   */
  getFilesInEditor = (editorState) => {
    return editorState.document.getBlocks().filter((block) => {
      return block.get('type') == "file"
    }).map((fileBlock) => {
      return fileBlock.getIn(['data', 'base'])
    })
  }

  /**
   * Insert an file with `path` at the current selection.
   *
   * @param {State} editorState
   * @param {String} base filename with suffix
   * @return {State}
   */

  insertFile = (editorState, base) => {
    return editorState
      .transform()
      .insertBlock({
        type: 'file',
        isVoid: true,
        data: { base }
      })
      .apply()
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