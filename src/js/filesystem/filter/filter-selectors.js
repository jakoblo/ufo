import { createSelector } from 'reselect'
import Selection from '../selection/sel-index'
import nodePath from 'path'

export const getGlobal = (state) => state.filter.get('global')
export const getLocal = (state, props) => {
  let focused = Selection.selectors.isFocused(state, props)
  return focused ? state.filter.get('focused') : []
}
export const getUserInput = (state) => state.getIn(['focused', 'userInput', 'input'])

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