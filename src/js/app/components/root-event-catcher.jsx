"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import { keyEventHandler } from '../../shortcuts/key-event-handler'
import { keyMap } from '../../shortcuts/key-map'
import Selection from '../../filesystem/selection/sel-index'
import Filter from '../../filesystem/filter/filter-index'
import Rename from '../../filesystem/rename/rename-index'
import App from '../app-index'
import { remote  } from 'electron'


export default class EventCatcher extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="root-event-catcher"
        onDragEnter={this.stopEvent}
        onDragOver={this.stopEvent}
        onDrop={this.stopEvent}
        onKeyDown={keyEventHandler( keyMap.global, this.keyAction )}
        tabIndex={-1}
        ref="eventCatcher"
      >{this.props.children}</div>
    )
  }

  componentDidMount(prevProps, prevState) {
    // Focus to catch events
    var node = ReactDOM.findDOMNode(this.refs["eventCatcher"]);
    node.focus();
  }

  keyAction = (action, event) => {
    if(this.actionMap[action]) {
      window.store.dispatch( this.actionMap[action]() )
    } else if( 
      event.key.length == 1 &&
      !event.metaKey &&
      !event.ctrlKey 
    ) {
      // window.store.dispatch( Selection.actions.selectTypeInputAppend(event.key) )
      window.store.dispatch( Filter.actions.userInputAppend(event.key) )
    }
  }

  actionMap = {
    navUp: Selection.actions.fileNavUp,
    selectUp: Selection.actions.fileAddUp,
    pathUp: App.actions.navigateToParentFolder,
    navDown: Selection.actions.fileNavDown,
    selectDown: Selection.actions.fileAddDown,
    navRight: Selection.actions.dirNext,
    navLeft: Selection.actions.dirPrevious,
    selectAll: Selection.actions.selectAll,
    rename: Rename.actions.renameSelected,
    moveToTrash: Selection.actions.toTrash,
    toggleHiddenFiles: Filter.actions.toggleHiddenFiles,
    // clearFilter: Selection.actions.selectTypeInputClear,
    clearFilter: Filter.actions.userInputClear,
    // deleteFilter: Selection.actions.selectTypeInputBackspace,
    deleteFilter: Filter.actions.userInputBackspace,
    filePreview: () => (dispatch, getState) => {
      let selectedFile = Selection.selectors.getFocusedFile(getState()) 
      if(selectedFile) {
        remote.getCurrentWindow().previewFile( selectedFile )
      }
    }
  }

  stopEvent (e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "none"
  }
}
