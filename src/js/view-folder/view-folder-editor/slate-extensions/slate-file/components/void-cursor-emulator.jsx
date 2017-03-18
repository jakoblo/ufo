"use strict"
import React from 'react'
import classnames from 'classnames'
import * as Selection from '../slate-file-selection'
import * as Blocks from '../slate-file-blocks'

export default class VoidCursorEmulator extends React.Component {

  constructor(props) {
    super(props)
  }

 render() {
    const {editor, node} = this.props
    const state = editor.getState()
    const selection = state.selection
    const cursorLeft = selection.hasFocusAtStartOf(node)
    const cursorRight = selection.hasFocusAtEndOf(node)

    const classes = classnames({
      "void-cursor-emulator": true,
      "void-cursor-emulator--cursor-left": cursorLeft,
      "void-cursor-emulator--cursor-right": cursorRight
    })

    return (
      <div
        className={classes}
        onClick={ (event) => {
          // Prevent Selection change in slate editor
          event.stopPropagation()
          event.preventDefault()
          this.props.editor.focus()
        }} 
        data-dings={node.key}
        onMouseDown = {(event) => {
          event.stopPropagation()
          //event.preventDefault()
          if(event.shiftKey) {
            this.expandSelection()
          }
        }}
        onMouseUp = {
          (event) => {
            event.stopPropagation()
            if(!event.ctrlKey && !event.metaKey && !event.shiftKey) {
              this.setSelection()
            }
          }
        }
        >
        {this.props.children}
      </div>
    )
  }

   expandSelection = (event) => {
      const {node, editor} = this.props
      const state = editor.getState()
      const {selection} = state
      const startNode = state.document.findDescendant((node) => node.key == selection.startKey)
      const startIndex = Blocks.getIndexOfNodeInDocument(state, startNode)
      const currentIndex =  Blocks.getIndexOfNodeInDocument(state, node)
      const transformFunc = (startIndex > currentIndex) ? "extendToStartOf" : "extendToEndOf"

      editor.onChange( state.transform()[transformFunc](node).focus().apply() )
    }

    setSelection = (event) => {
      console.log('setslection')
      const {editor, node} = this.props
      const state = editor.getState()

      const newSelection = Selection.createSelectionForFile(node)

      editor.onChange( state.transform().select( newSelection ).apply() )

    }


}


