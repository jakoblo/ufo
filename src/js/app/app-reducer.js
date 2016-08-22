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
      case t.APP_CHANGE_PATH:
      // console.log("APP REDUCER")
        // return state.setIn(['groupItems', action.payload.groupID, 'title'], action.payload.newName)
        return state
        break;
      default:
        return state;
    }

  }
