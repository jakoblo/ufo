"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import classNames from 'classnames'
import * as c from '../filter-constants'
import * as t from '../filter-actiontypes'
import * as FilterSelectors from '../filter-selectors'

@connect(() => {
  return (state, props) => {
    return {
      focused: FilterSelectors.isFocused(state, props),
      input: FilterSelectors.getUserInput(state, props)
    }
  }
})
export default class FilterTypeInput extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className={classNames({
          'filterTypeInput': true,
          'visible': this.props.focused && this.props.input && this.props.input.length > 0
        })}
      >
        <label>Filter By:</label>
        <input readOnly={true} value={this.props.input || ""} />
      </div>
    )
  }
}
