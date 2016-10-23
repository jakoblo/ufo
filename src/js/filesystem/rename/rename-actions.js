import * as t from './rename-actiontypes'
import * as selectors from './rename-selectors'
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

export function renameStart(filePath) {
  return {
    type: t.RENAME_START,
    payload: {
      path: filePath
    }
  }
}

export function renameCancel(filePath) {
  return {
    type: t.RENAME_CANCEL,
    payload: {
      path: filePath
    }
  }
}

export function renameSave(filePath, newName) {
  return function (dispatch, getState) {
    dispatch({
      type: t.RENAME_SAVE,
      payload: {
        path: filePath,
        newName: newName
      }
    })

    console.log(filePath, newName)

    fsWrite.actions.rename(
      filePath,
      nodePath.join( nodePath.dirname(filePath), newName ) 
    )
  }
}

