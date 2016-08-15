"use strict"
import React from 'react'
import { increment, decrement, asyncCalculate } from '../actions/counterActions'
import { connect } from 'react-redux'

@connect((store) => {
  return store.counter
})
export class Counter extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  asyncInc = () => { this.props.dispatch( asyncCalculate(this.props.count, 10)) }
  asyncDec = () => { this.props.dispatch(asyncCalculate(this.props.count, -10)) }

  syncInc = () => { this.props.dispatch(increment()) }
  syncDec = () => { this.props.dispatch(decrement()) }

  render() {

    if(this.props.calculating == false) {
      var display = 'Counter '+this.props.count
    } else {
      var display = 'Calculating...'
    }

    return(
      <div>
        <h2>{display}</h2>
        <div>Async---
          <button onClick={this.asyncInc} > +10 </button>
          <button onClick={this.asyncDec} > -10 </button>
        </div>
        <div>Sync---
          <button onClick={this.syncInc} > +1 </button>
          <button onClick={this.syncDec} > -1 </button>
        </div>
      </div>
    )
  }
}
