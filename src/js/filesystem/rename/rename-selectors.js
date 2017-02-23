import { createSelector } from 'reselect'
import nodePath from 'path'

/**
 * The Filepath of the File which is currently renaming
 * The Input field to change the FileName should be visible
 * 
 * @param  {State} state - redux store state
 * @returns {string} - path of the file
 */
export const getCurrent = (state) => state.rename.get('current')

/**
 * Is File currently in rename state?
 * 
 * @param  {State} state - redux store state
 * @param  {string} path - of the file
 * @returns {boolean}
 */
export const isFileRenaming = (state, path) => {
  return (getCurrent(state) == path)
}


// export const getRenamingForDirectory = (state, path) => {
//   if(path == nodePath.dirname(state.rename.get('current'))) {
//     return nodePath.basename( state.rename.get('current') )
//   } else {
//     return null
//   }
// }