"use strict"
const {
  COUNTER_INCREMENT,
  COUNTER_DECREMENT,
  COUNTER_REQUEST_VALUE,
  COUNTER_RECEIVE_VALUE
} = require('../constants/action-types')


const INITIAL_STATE = {
  count: 0,
  calculating: false,
  error: false
}

export function counterReducer(state = INITIAL_STATE, action = { type: '' }) {
  switch (action.type) {

    case COUNTER_INCREMENT:
      return {...state, count: state.count + 1}

    case COUNTER_DECREMENT:
      return {...state, count: state.count - 1}

    case COUNTER_REQUEST_VALUE:
      return {...state, calculating: true}

    case COUNTER_RECEIVE_VALUE:
      return {...state,
        calculating: false,
        count: action.payload.value
      }

    default:
      return state;

  }
}
