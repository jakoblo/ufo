import { createSelector } from 'reselect'
import Selection from '../selection/sel-index'
import nodePath from 'path'
import {List} from 'immutable'

/**
 * Filter which have to applied for every folder
 * 
 * @param  {State} state - redux store state
 * @returns {ImmuteableList}
 */

export const getGlobal = (state) => state.filter.get('global')

/**
 * Local Filter which are currently active for the given Path
 * 
 * @param  {State} state - redux store state
 * @param  {string} path - of the Folder
 * @returns {ImmuteableList}
 */
export const getLocal = (state, path) => {
  let focused = isFocused(state, path)
  return focused ? state.filter.get('focused') : List([])
}

/**
 * The String which the User is currently Filtering for
 * 
 * @param  {State} state - redux store state
 * @returns {string}
 */
export const getUserInput = (state) => state.filter.getIn(['focused', 'userInput', 'input'])

/**
 * Focused is the folder where Typing-Filter is applied
 * Which Filter is focused is deciedet in the Filter-Reducer
 * 
 * @param  {State} state - redux store state
 * @returns  {string} Filesystem-Path
 */
export const getFocused = (state) => state.filter.get('focusedPath')

/**
 * Focused is the folder where Typing-Filter is applied
 * Which Filter is focused is deciedet in the Filter-Reducer
 * 
 * @param {State} state - redux store state
 * @param  {string} path - of the Folder
 * @returns {boolean}
 */
export const isFocused = (state, path) => (getFocused(state) == path)

/**
 * Factroy for Selector that returns an Array of regular Expressions 
 * to filter the files for the given folder
 * 
 * @returns {Function(state, path)} reselect
 */
export const getFiterRegExOfFolder_Factory = () => {


  return createSelector(
    [getGlobal, getLocal],
    (globFilter, localFilter) => {
      return [
        ...globFilter
            .toIndexedSeq()
            .toJS()
        , 
        ...localFilter
            .map(entry => entry.get('regEx'))
            .toIndexedSeq()
            .toJS()
      ]
    }
  )
}