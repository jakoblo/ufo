"use strict"
import React from 'react'
import classnames from 'classnames'
import Button from '../../general-components/button'
import { keyEventHandler } from '../../shortcuts/key-event-handler'
import { keyMap } from '../../shortcuts/key-map'
import {remote} from 'electron'
const {Menu, MenuItem} = remote

//@TODO remove this.props.hideButtonText

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
                onClick={(e) => {e.stopPropagation();}}
              />
    } else {
      title = <div className="nav-bar-group__title__text">
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
         onClick={this.props.onToggleGroup}
         onContextMenu={!this.props.isDiskGroup && this.onContextMenu}
      >
        <div className="nav-bar-group__title__arrow"  />
        {title}
        { !this.props.isDiskGroup ?
          <button className="nav-bar-group__title__button-burger-menu" onClick={this.onContextMenu} /> : null
        }
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

  onContextMenu = (event) => {
    event.preventDefault()
    event.stopPropagation()
    let menu = new Menu();
    menu.append(new MenuItem({ label: 'Remove', click: this.props.onGroupRemove }))
    menu.append(new MenuItem({ label: 'Rename', click: () => {this.setState({editGroupTitle: true})} }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({label: this.props.hidden ? "show" : "hide", click: this.props.onToggleGroup }))


    menu.popup(remote.getCurrentWindow());
  }
}
