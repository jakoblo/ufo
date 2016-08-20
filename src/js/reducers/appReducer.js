"use strict"
import Immutable from 'immutable'
import { List } from 'immutable'
import {
  APP_CHANGE_PATH
  } from '../constants/action-types'

const INITIAL_STATE = {pathList: List([])}

// TESTwofü
const TEST_STATE = Immutable.fromJS({pathList: [
      "/Users/jakoblo/Desktop",
      "/Users/jakoblo/Documents",
      "/Users/jakoblo/Downloads"
    ]
  })

  export function appReducer(state = TEST_STATE, action = { type: '' }) {

    switch (action.type) {
      case APP_CHANGE_PATH:
      // console.log("APP REDUCER")
        // return state.setIn(['groupItems', action.payload.groupID, 'title'], action.payload.newName)
        return state
        break;
      default:
        return state;
    }

  }
