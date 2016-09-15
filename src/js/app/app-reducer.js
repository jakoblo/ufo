"use strict"
import Immutable from 'immutable'
import { List } from 'immutable'
import * as t from './app-actiontypes'

const INITIAL_STATE = {pathList: List([])}

// TESTwofü
const TEST_STATE = Immutable.fromJS({pathList: [
      "/Users/jakoblo/Desktop",
      "/Users/jakoblo/Documents",
      "/Users/jakoblo/Downloads"
    ]
  })

  export default function appReducer(state = TEST_STATE, action = { type: '' }) {

    switch (action.type) {
      default:
        return state;
    }

  }
