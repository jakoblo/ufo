import * as t from './filter-actiontypes'
import * as selectors from './filter-selectors'
import Selection from '../selection/sel-index'
import fsWrite from '../write/fs-write-index'
import nodePath from 'path'
import * as _ from 'lodash'


export function renameSelected() {
  return function (dispatch, getState) {
    let currentSelectedFile = Selection.selectors.getCurrentFile(getState())
    if(currentSelectedFile) {
      dispatch( renameStart( currentSelectedFile ))
    }
  }
}

/**
 * @export
 * @param {string} filePath
 */
window.test = userSet
export function userSet(path, filterString) {
  return {
    type: t.FILTER_USER_SET,
    payload: {
      filterString: filterString,
      path: path
    }
  }
}

window.clear = userClear
export function userClear(path, filterString) {
  return {
    type: t.FILTER_USER_CLEAR,
    payload: {
      path: path
    }
  }
}

