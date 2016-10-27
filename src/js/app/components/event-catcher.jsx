"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import { keyEventHandler } from '../../shortcuts/event-handler'
import { keyMap } from '../../shortcuts/shortcut-map'
import Selection from '../../filesystem/selection/sel-index'
import Filter from '../../filesystem/filter/filter-index'
import Rename from '../../filesystem/rename/rename-index'
import App from '../app-index'


export default class EventCatcher extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="foundation"
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
    } else if( event.key.length == 1 ) {
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
    clearFilter: Filter.actions.userInputClear,
    deleteFilter: Filter.actions.userInputBackspace,
  }

  stopEvent (e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "none"
  }
}
