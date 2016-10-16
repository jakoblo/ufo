"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import fsWrite from '../../filesystem/write/fs-write-index'
import nodePath from 'path'

export default class RenameInput extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      fileName: this.props.fileName
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

  onMouseDown = (event) => {
    event.stopPropagation();
  }

  onMouseUp = (event) => {
    event.stopPropagation();
  }

  onBlur = (event) => {
    this.renameSave(event)
  }


  onKeyDown = (event) => {
    console.log('key down', event.which)
    console.log(event)
    event.persist()
    event.stopPropagation();
    event.preventDefault();
    if (event.which === 27) {  // Escape
      this.props.renameStop()
    } else if (event.which === 13) { // Enter
      this.renameSave(event);
    }
  }

  onChange = (event) => {
    event.persist()
    event.stopPropagation();
    event.preventDefault();
    this.setState({'fileName': event.target.value})
  }

  renameSave = (event) => {
    var val = this.state.fileName.trim()
    if (val != this.props.fileName) {
      fsWrite.actions.rename(
        this.props.path,
        nodePath.join(this.props.root, val) 
      )
    } else {
      this.props.renameStop()
    }
  }
}
