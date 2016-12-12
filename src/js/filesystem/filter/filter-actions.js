import * as t from './filter-actiontypes'
import * as selectors from './filter-selectors'
import * as fsMergedSelector from '../fs-merged-selectors'
import nodePath from 'path'
import * as _ from 'lodash'
import Selection from '../selection/sel-index'
import App from '../../app/app-index'
import ViewFile from '../../view-file/vf-index'

export function toggleHiddenFiles() {
  return function (dispatch, getState) {
    if(selectors.getGlobal(getState()).get('notHidden')) {
      dispatch( showHidden() )
    } else {
      dispatch( hideHidden() )
    }
  }
}
export function showHidden() {
  return {type: t.FILTER_SHOW_HIDDEN}
}
export function hideHidden() {
  return {type: t.FILTER_HIDE_HIDDEN}
}
 
export function userInputAppend(append) { 
  return function (dispatch, getState) {
    let existingFilterString = selectors.getUserInput(getState())
    let newFilterString = (existingFilterString) ? existingFilterString + append : append; 
    dispatch(
      userInputSet( newFilterString )
    )
  }
}

export function userInputBackspace() {
  return function (dispatch, getState) {
    
    let existingFilterString = selectors.getUserInput(getState())
    
    if(existingFilterString && existingFilterString.length > 0) {
      dispatch(
        userInputSet( existingFilterString.slice(0, -1) )
      )
    } else {
      dispatch( userInputClear() )
    }
  }
}


export function userInputSet(inputString) {
  return function (dispatch, getState) {
    dispatch({
      type: t.FILTER_USER_SET,
      payload: {
        input: inputString,
        // Search only from start
          //regEx: new RegExp('^\\.?'+inputString, "i") // RegExp = /^\.?Filename/i > match .filename & fileName
        // Search Everywhere
        regEx: new RegExp('('+inputString+')', "i") // RegExp = (Filename) match everywhere
      }
    })

    // FROM HERE VERY VERY VERY DIRY!
    let focusedDirPath = selectors.getFocused(getState())
    let firstFilteredFile = fsMergedSelector.getFiltedFilesSeq_Factory()(
      getState(), 
      { path: focusedDirPath }
    )[0]

    if(firstFilteredFile) {
      let targetFolder, targetFile = null

      
      if(nodePath.extname(firstFilteredFile)) {
        targetFolder = focusedDirPath 
        targetFile = nodePath.join(focusedDirPath, firstFilteredFile) 
      } else {
        targetFolder = nodePath.join(focusedDirPath, firstFilteredFile)
      }

      dispatch( App.actions.changeAppPath( null, targetFolder, false, true ) )
      if(targetFile) {
        dispatch( ViewFile.actions.showPreview(targetFile) )
      }
    }
  }
}

export function userInputClear() {
  return {
    type: t.FILTER_USER_CLEAR
  }
}

