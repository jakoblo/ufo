"use strict"
import React from 'react'
import classnames from 'classnames'
import * as actions from '../folder-editor-actions'
import { connect } from 'react-redux'

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
export default class EditorReadOnlyToggle extends React.Component {

  constructor(props) {
    super(props)
  }

 render() {
    let className = classnames(
      this.props.className, {
        'folder-editor__ready-only-toggle': true,
        'folder-editor__ready-only-toggle--ready-only': this.props.readOnly
      })

    return (
      <div onClick={this.toggle} className={className}>
        <div class="folder-editor__ready-only-toggle__switch"/>
      </div>
    )
  }

  toggle = () => {
    this.props.dispatch( actions.toggleReadOnly() )
  }

}
