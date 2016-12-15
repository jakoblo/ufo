import React from 'react'
import { connect } from 'react-redux'
import * as Selectors from  '../fs-write-selectors'
import WriteAction from  './fs-write-action'
import classnames from 'classnames'
import {Map} from 'immutable'

@connect(() => {
  return (state, props) => {
    return {
      fsWrite: Selectors.getFSWrite(state, props)
    }
  }
})
export default class DisplayList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let actionList = ""
    if(this.props.fsWrite && this.props.fsWrite.size > 0) {
      actionList = this.props.fsWrite.valueSeq().map((writeAction, index) => {
        return ( <WriteAction
          key={index}
          action={writeAction}
          dispatch={this.props.dispatch}
        /> )
      })
    } else {
      actionList = <div className="noFileActions">No file movements</div>
    }

    return(
      <div className="fs-write-overview">
        {actionList}
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.fsWrite !== this.props.fsWrite // || nextState.data !== this.state.data;
  }
}
