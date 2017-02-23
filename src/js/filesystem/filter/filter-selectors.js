import { createSelector } from 'reselect'
import Selection from '../selection/sel-index'
import nodePath from 'path'
import {List} from 'immutable'

/**
 * Filter which have to applied for every folder
 */
export const getGlobal = (state) => state.filter.get('global')

/**
 * Filter for the given Path
 */
export const getLocal = (state, props) => {
  let focused = isFocused(state, props)
  return focused ? state.filter.get('focused') : List([])
}

/**
 * The String which the User is currently Filtering for
 */
export const getUserInput = (state) => state.filter.getIn(['focused', 'userInput', 'input'])

/**
 * Focused is the folder where Typing-Filter is applied
 * Which Filter is focused is deciedet in the Filter-Reducer
 * 
 * @param  {Objecct} state
 * @returns  {String} Filesystem-Path
 */
export const getFocused = (state) => state.filter.get('focusedPath')

/**
 * Focused is the folder where Typing-Filter is applied
 * Which Filter is focused is deciedet in the Filter-Reducer
 * 
 * @param  {Objecct} state
 * @returns  {Boolean}
 */
export const isFocused = (state, props) => (getFocused(state) == props.path)

/**
 * Factroy for Selector that returns an Array of regular Expressions 
 * to filter the files for the given folder
 * @returns {Function} reselect
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