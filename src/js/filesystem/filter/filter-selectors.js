import { createSelector } from 'reselect'
import Selection from '../selection/sel-index'
import nodePath from 'path'
import {List} from 'immutable'

export const getGlobal = (state) => state.filter.get('global')
export const getLocal = (state, props) => {
  let focused = isFocused(state, props)
  return focused ? state.filter.get('focused') : List([])
}
export const getUserInput = (state) => state.filter.getIn(['focused', 'userInput', 'input'])

export const getFocused = (state) => state.filter.get('focusedPath')
export const isFocused = (state, props) => (getFocused(state) == props.path)

/**
 * Factroy for Selector that returns an Array of regular Expressions 
 * to filter the files for the given folder
 * @returns {Function} reselect
 */
export const getFiterRegExForFolder_Factory = () => {
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