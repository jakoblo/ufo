"use strict"
import React from 'react'
import { connect } from 'react-redux'
import Config from '../../config/config-index'
import * as selectors from '../../config/config-selectors'
import { List } from 'immutable'
import classnames from 'classnames'

@connect((state) => {
  return {readOnly: selectors.getReadOnlyState(state)}
})
export default class ReadOnlyToggle extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let classes = classnames(
      'read-only-toggle',
      {'read-only-toggle--read-only': this.props.readOnly}
    )

    return(
      <div className={classes} onClick={this.toggle} >
        <div className="read-only-toggle__bullet" />
      </div>
    )
  }

  toggle = () => {
    this.props.dispatch(Config.actions.toggleReadOnly())
  }

}
