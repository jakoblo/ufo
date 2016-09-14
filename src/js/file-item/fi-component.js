"use strict"
import {remote, Menu, MenuItem} from 'electron'
import React from 'react'
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
        dropBlocked: false
      })
    } 
    this.clickHandler = eventHandler.getClick(this)
    this.dragndropHandler = eventHandler.getDragnDrop(this)
  }

  render() {
    return (
      <span
        className={classNames({
          'file-item': true,
          'edit': this.state.editing,
          'folder': this.props.file.get('type') == "DIR", //@todo constant
          'file': this.props.file.get('type') == "FILE", //@todo constant
          'active': this.props.file.get('active'),
          'selected': this.props.file.get('selected'),
          'drag-target': this.state.data.get('dropTarget'),
          'drag-blocked': this.state.data.get('dropBlocked')
        })}
      >
        <span className="flex-box">
          <Icon glyph={classNames({
            'folder': this.props.file.get('type') == "DIR", //@todo constant
            'file': this.props.file.get('type') == "FILE" //@todo constant
          })}/>
          <label>
            <span className="base">{this.props.file.get('name')}</span>
            <span className="suffix">{this.props.file.get('suffix')}</span>
          </label>
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

}
