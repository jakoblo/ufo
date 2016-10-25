import * as t from './filter-actiontypes'
import * as selectors from './filter-selectors'
import Selection from '../selection/sel-index'
import fsWrite from '../write/fs-write-index'
import nodePath from 'path'
import * as _ from 'lodash'


export function userInputAppend(append) {
  return function (dispatch, getState) {
    dispatch(
      userInputSet( selectors.getUserInput(getState()) + append )
    )
  }
}

export function userInputBackspace() {
  return function (dispatch, getState) {
    dispatch(
      userInputSet( selectors.getUserInput(getState()).slice(0, -1) )
    )
  }
}

export function userInputSet(inputString) {
  return {
    type: t.FILTER_USER_SET,
    payload: {
      input: inputString,
      regEx: new RegExp('^\\.?'+inputString, "i") // RegExp = /^\.?Filename/i > match .filename & fileName
    }
  }
}

export function userInputClear() {
  return {
    type: t.FILTER_USER_CLEAR
  }
}

