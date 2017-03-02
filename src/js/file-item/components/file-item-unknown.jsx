"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import ProgressPie from '../../general-components/progress-pie'

export default class FileItemUnkown extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className={classNames({
          [this.props.className]: true,
          [this.props.className+'--in-progress']: true,
          [this.props.className+'--theme-file']: true,
        })}
      >
        <ProgressPie
          className={this.props.className+'__progress-pie'}
          progress={0}
          size={16}
        />
        <div className={this.props.className+'__name-base'} >Unknown</div>
      </div>
    )
  }
}
