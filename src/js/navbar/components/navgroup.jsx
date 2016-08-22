"use strict"
import React from 'react'
import { connect } from 'react-redux'
import nodePath from 'path'
import classnames from 'classnames'
import Icon from '../../general-components/icon'
import Button from '../../general-components/button'

export default class NavGroup extends React.Component {
  constructor(props) {
    super(props)
  }

  createGroupItem = (path, itemID) => {
    let basePath = nodePath.basename(path)
    let active = false
    if(path === this.props.activeItem)
    active = true
    let glyph = "folder"
    // if(path.ext) {
    //   let res = path.ext.replace(".", "")
    //   glyph = "file " + res
    // }

    return (
      <NavGroupItem
        key={itemID}
        onClick={this.props.onSelectionChanged.bind(this, path)}
        onItemRemove={this.props.onItemRemove.bind(this,this.props.groupID, itemID)}
        title={basePath}
        active={active}
        glyph={glyph}
        >
      </NavGroupItem>)
  }

  handleOnTitleDoubleClick() {

  }

  render() {
    let hideButtonText = this.props.hidden ? "show" : "hide";
    let itemWrapperClasses = classnames({
      'nav-group-item-wrapper': true,
      'hide': this.props.hidden
    });
    return(
      <div className="nav-group">
        <NavGroupTitle title={this.props.title} groupID={this.props.groupID} onGroupTitleChange={this.props.onGroupTitleChange} hideButtonText={hideButtonText} onClick={this.props.onHideGroup.bind(this, this.props.groupID)}/>
        <div className={itemWrapperClasses}>
          {this.props.items.map(this.createGroupItem)}
        </div>
      </div>
    )
  }
}

/*
*
* NAVGROUP ITEM
*
*/

class NavGroupItem extends React.Component {
  constructor(props) {
    super(props)
  }

 render() {
    // let icon = this.getIconComponent()
    let className = classnames(this.props.className, "nav-group-item", {"active": this.props.active})

    return (
      <a onClick={this.props.onClick} className={className}>
        <Icon glyph={this.props.glyph} />
        <span className="text">{this.props.title}</span>
        <Button className="remove" onClick={this.props.onItemRemove}></Button>
      </a>
    )
  }
}

/*
*
* NAVGROUP TITLE
*
*/

class NavGroupTitle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {editGroupTitle: false}
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  componentDidUpdate(prevProps, prevState) {
    this.refs.input && this.refs.input.focus();
  }

  handleDoubleClick = () => {
    this.setState({editGroupTitle: true})
  }

  changeTitle(e) {
    if(e.keyCode === 13 || e.type === 'blur') {
      if(this.props.title != e.target.value && e.target.value != '') {
      this.props.onGroupTitleChange(this.props.groupID, e.target.value)
      }
      this.setState({editGroupTitle: false})
    }
  }

  handleKeyDown = (e) => {
    this.changeTitle(e)
  }

  handleOnBlur = (e) => {
    this.changeTitle(e)
  }

  handleHideGroup = () => {
    this.set
  }

 render() {
   let title = <span className="nav-group-text" onDoubleClick={this.handleDoubleClick}>{this.props.title}</span>
   if(this.state.editGroupTitle) {
     title = <input ref="input" onBlur={this.handleOnBlur} defaultValue={this.props.title} onKeyDown={this.handleKeyDown}></input>
   }

  return (
      <div className="nav-group-title">
        {title}
        <Button className="nav-group-hide" onClick={this.props.onClick} text={this.props.hideButtonText}/>
      </div>
    )
  }
  // <Button className="nav-group-hide" text={this.props.hideButtonText} onClick={this.props.onHide}/>
}
