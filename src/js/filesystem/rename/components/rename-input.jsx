"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import * as actions from '../rename-actions'
import nodePath from 'path'

export default class RenameInput extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      fileName: nodePath.basename(this.props.path)
    }
  }

  render() {
    return (
      <input
        ref="editField"
        className="edit"
        value={this.state.fileName}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
      />
    )
  }

  componentDidMount(prevProps, prevState) {
    // Focus rename input
    var node = ReactDOM.findDOMNode(this.refs["editField"]);
    node.focus();
    node.setSelectionRange(0, node.value.length);
  }

  onMouseDown = (event) => { event.stopPropagation() }
  onMouseUp = (event) => { event.stopPropagation() }
  onBlur = (event) => { console.log('blur'); this.renameSave(event) }

  onKeyDown = (event) => {
    event.stopPropagation();
    if (event.which === 27) {  // Escape
      this.renameCancel()
    } else if (event.which === 13) { // Enter
      this.renameSave(event);
    }
  }

  onChange = (event) => {
    this.setState({'fileName': event.target.value})
    event.persist()
    event.stopPropagation();
    event.preventDefault();
  }

  renameSave = (event) => {
    var val = this.state.fileName.trim()
    if (val != nodePath.basename(this.props.path)) {
      this.props.dispatch( actions.renameSave( this.props.path, val) )
    } else {
      this.renameCancel()
    }
  }

  renameCancel = () => {
    this.props.dispatch( actions.renameCancel( this.props.path) )
  }
}
