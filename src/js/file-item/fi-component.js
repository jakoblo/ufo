"use strict"
import {remote, Menu, MenuItem} from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import Icon from '../general-components/icon'
import classNames from 'classnames'
import {Map} from 'immutable'
import {ipcRenderer} from 'electron'
import eventHandler from './fi-event-handler/fi-event-handler-index'

export default class FileItemDisplay extends React.Component {

  constructor(props) {
    super(props)
    this.dragOverTimeout = null
    this.state = {
      data: Map({
        fileName: this.props.file.get('base'),
        editing: false,
        dropTarget: false,
        dropBlocked: false,
        openAnimation: false
      })
    }
    this.clickHandler = eventHandler.getClick(this)
    this.dragndropHandler = eventHandler.getDragnDrop(this)
    this.renameHandler = eventHandler.getRename(this)
  }

  render() {
    
    return (
      <span
        className={classNames({
          'file-item': true,
          'edit': this.state.data.get('editing'),
          'folder': this.props.file.get('stats').isDirectory(),
          'file': this.props.file.get('stats').isFile(),
          'active': this.props.file.get('active'),
          'selected': this.props.file.get('selected'),
          'drag-target': this.state.data.get('dropTarget'),
          'drag-blocked': this.state.data.get('dropBlocked'),
          'open-animation': this.state.data.get('openAnimation')
        })}
      >
        <span className="flex-box">
          <Icon glyph={classNames({
            'folder': this.props.file.get('stats').isDirectory(),
            'file': this.props.file.get('stats').isFile()
          })}/>
          <label>
            <span className="base">{this.props.file.get('name')}</span>
            <span className="suffix">{this.props.file.get('suffix')}</span>
          </label>
          <input
            ref="editField"
            className="edit"
            value={this.state.data.get('fileName')}
            {...this.renameHandler}
          />
        </span>
        <span className="eventCatcher" 
          draggable={true}
          {...this.clickHandler}
          {...this.dragndropHandler}
        />
      </span>
    )
  }

  setImmState(fn) {
    // https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state
    return this.setState(({data}) => ({
      data: fn(data)
    }));
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.file !== this.props.file || nextState.data !== this.state.data;
  }

  componentDidUpdate(prevProps, prevState) {
    if(!prevState.data.get('editing') && this.state.data.get('editing')) {
      // Focus rename input
      var node = ReactDOM.findDOMNode(this.refs["editField"]);
      node.focus();
      node.setSelectionRange(0, node.value.length);
    }
  }
}
