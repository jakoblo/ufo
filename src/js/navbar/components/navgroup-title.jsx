"use strict"
import React from 'react'
import classnames from 'classnames'
import Button from '../../general-components/button'
import { keyEventHandler } from '../../shortcuts/key-event-handler'
import { keyMap } from '../../shortcuts/key-map'

export default class NavGroupTitle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {editGroupTitle: false}
  }

  render() {
  
    let title;
    if(this.state.editGroupTitle) {
      title = <input 
                ref="input" 
                className="nav-bar-group__title__rename-input" 
                onBlur={this.handleOnBlur} 
                defaultValue={this.props.title} 
                onKeyDown={keyEventHandler(keyMap.renameInput, this.shortcutHandler)} 
              />
    } else {
      title = <div 
                className="nav-bar-group__title__text" 
                onDoubleClick={!this.props.isDiskGroup && this.handleDoubleClick}
              >
                {this.props.title}
              </div>
    }
  
    return (
      <div
        className={
          classnames({
            'nav-bar-group__title': true,
            'nav-bar-group__title--editing': this.state.editGroupTitle
          })}
        onContextMenu={this.props.onContextMenu}
      >
        <div className="nav-bar-group__title__arrow"  onClick={this.props.onToggleGroup} />
        {title}
        <button className="nav-bar-group__title__button-collapse-toggle" onClick={this.props.onToggleGroup}>
          {this.props.hideButtonText}
        </button>
      </div>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    this.refs.input && this.refs.input.focus();
  }

  saveTitle(title) {
    if(this.props.title != title && title != '') {
      this.props.onGroupTitleChange(title)
    }
    this.setState({editGroupTitle: false})
  }

  cancelTitleEdit() {
    this.setState({editGroupTitle: false})
  }

  handleDoubleClick = () => {
    this.setState({editGroupTitle: true})
  }

  handleKeyDown = (e) => {
    this.changeTitle(e)
  }

  handleOnBlur = (e) => {
    console.log('blur')
    this.saveTitle(e.target.value)
  }

  shortcutHandler = (action, event) => {
    event.stopPropagation()
    switch (action) {
      case "cancel":
        this.cancelTitleEdit()
        break;
      case "save":
        this.saveTitle(event.target.value);
        break;
    }
  }
}
