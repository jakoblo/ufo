"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import classNames from 'classnames'
import * as c from '../filter-constants'
import * as t from '../filter-actiontypes'
import Selection from '../../selection/sel-index'
import * as FilterSelectors from '../filter-selectors'

@connect(() => {
  return (state, props) => {
    return {
      focused: Selection.selectors.isFocused(state, props),
      input: FilterSelectors.getUserInput(state, props)
    }
  }
})
export default class FilterUserInput extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    console.log(this.props.focused)
    return (
      <div
        className={classNames({
          'filterUserInput': true,
          'visible': this.props.focused && this.props.input && this.props.input.length > 0
        })}
      >
        <label>Filter By:</label>
        <input value={this.props.input} />
      </div>
    )
  }
}
