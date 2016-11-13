"use strict"
import {remote, Menu, MenuItem} from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import Icon from '../../general-components/icon'
import classNames from 'classnames'
import {Map} from 'immutable'
import eventHandler from '../fi-event-handler/fi-event-handler-index'
import RenameInput from '../../filesystem/rename/components/rename-input'
import ProgressPie from '../../general-components/progress-pie'

export default class FileItemComp extends React.Component {

  constructor(props) {
    super(props)
    this.dragOverTimeout = null
    this.state = {
      data: Map({
        renaming: false,
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
      <div
        className={classNames({
          [this.props.className]: true,
          [this.props.className+'--renaming']: this.props.file.get('renaming'),
          [this.props.className+'--theme-folder']: this.props.file.get('stats').isDirectory(),
          [this.props.className+'--theme-file']: this.props.file.get('stats').isFile(),
          [this.props.className+'--active']: this.props.file.get('active'),
          [this.props.className+'--selected']: this.props.file.get('selected'),
          [this.props.className+'--drop-target']: this.state.data.get('dropTarget'),
          [this.props.className+'--drop-blocked']: this.state.data.get('dropBlocked'),
          [this.props.className+'--open-animation']: this.state.data.get('openAnimation'),
          [this.props.className+'--in-progress']: this.props.file.get('progress')
        })}
        ref="file"
      >
        <div className={this.props.className+'__underlay'} />
        {this.props.file.get('progress') ? 
          <ProgressPie
            className={this.props.className+'__progress-pie'}
            progress={this.props.file.get('progress').get('percentage')}
            size={16}
          />
        : null }
        <div className={this.props.className+'__name-base'} >{this.props.file.get('name')}</div>
        <div className={this.props.className+'__name-suffix'} >{this.props.file.get('suffix')}</div>
        {this.props.file.get('renaming') ? 
          <RenameInput
            className={this.props.className+'__rename-input'}
            path={this.props.file.get('path')}
            dispatch={this.props.dispatch}
          />
        : null}
        <div className={this.props.className+'__event-catcher'} 
          draggable={true}
          {...this.clickHandler}
          {...this.dragndropHandler}
        />
      </div>
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
