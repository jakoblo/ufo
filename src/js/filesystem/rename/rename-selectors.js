import { createSelector } from 'reselect'
import nodePath from 'path'

export const getCurrent = (state) => state.rename.current

export const getRenamingForDirectory = (state, props) => {
  if(props.path == nodePath.dirname(state.rename.get('current'))) {
    return nodePath.basename( state.rename.get('current') )
  } else {
    return null
  }
}