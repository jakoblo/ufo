"use strict"
import React from 'react'
import classnames from 'classnames'
import Button from '../../general-components/button'

export default class NavGroupTitle extends React.Component {
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

  handleToggleGroup = () => {
    this.set
  }

 render() {
   let title = <span className="nav-group-text" 
   onDoubleClick={!this.props.isDiskGroup && this.handleDoubleClick}
   onContextMenu={this.props.onContextMenu}
   >{this.props.title}</span>
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
