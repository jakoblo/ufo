/**
 * 
 * SLATE JS EXPERIMENT
 * https://github.com/ianstormtaylor/slate
 * 
 */

import React from 'react'
import { connect } from 'react-redux'

import { Editor, Raw } from 'slate'

// initial state for Slate Editor
const initialState = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'A line of text in a paragraph.'
        }
      ]
    }
  ]
}, { terse: true })

export default class FolderEditor extends React.Component {
    constructor(props) {
        super(props)
        // Set the initial state when the app is first constructed.
        this.state = {
            state: initialState
        }
    }

  // On change, update the app's React state with the new editor state.
  onChange = (state) => {
    this.setState({ state })
  }

  // Render the editor.
  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
      />
    )
  }
}