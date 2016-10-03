"use strict"
import React from 'react'
import { connect } from 'react-redux'
import Config from '../config/config-index'
import { List } from 'immutable'
import classnames from 'classnames'

@connect((state) => {
  return {editMode: state.config.get('editMode')}
})
export default class ToggleBar extends React.Component {
  constructor(props) {
    super(props)
  }

  handleReadOnlyToggle = () => {
    this.props.dispatch(Config.actions.toggleEditMode(!this.props.editMode))
  }

  render() {
    let readOnlyButtonClass = classnames(
    'edit-mode-switch',
    'switch',
    {'readOnly': this.props.editMode})

    return(
      <div className="edit-mode-switch-wrapper">
        <button onClick={this.handleReadOnlyToggle} className={readOnlyButtonClass}/>
      </div>)
  }

}
