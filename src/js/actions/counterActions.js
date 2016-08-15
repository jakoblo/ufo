import {
  COUNTER_INCREMENT,
  COUNTER_DECREMENT,
  COUNTER_REQUEST_VALUE,
  COUNTER_RECEIVE_VALUE,
  } from '../constants/action-types'

// http://redux.js.org/docs/basics/Actions.html
export function increment() { // Action Creator
  return { // action
    type: COUNTER_INCREMENT,
  };
}

export function decrement() {
  return {
    type: COUNTER_DECREMENT,
  };
}

export function requestCounter() {
  return {
    type: COUNTER_REQUEST_VALUE
  }
}

export function receiveCounter(value) {
  return {
    type: COUNTER_RECEIVE_VALUE,
    payload: {
      value: value
    }
  }
}

export function asyncCalculate(currentValue, addValue) {
  return function (dispatch) {
    dispatch(requestCounter())
      setTimeout(() => {
        let value = currentValue + addValue
        dispatch(receiveCounter(value))
      }, 1000)
  }
}
