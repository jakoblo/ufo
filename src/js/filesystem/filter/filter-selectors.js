import { createSelector } from 'reselect'
import nodePath from 'path'

export const getGlobal = (state) => state.filter.get('global')
export const getSpecific = (state, props) => state.filter.getIn(['specific', props.path])

export const getFiterForFolderFactory = () => {
  return createSelector(
    [getGlobal, getSpecific],
    (globFilter, specific) => {
      return [...globFilter.toIndexedSeq().toJS(), specific]
  })
}