//@flow

import { createSelector } from "reselect";
import nodePath from "path";

/*
 * The Filepath of the File which is currently renaming
 * The Input field to change the FileName should be visible
 */
export const getCurrent = (state: any): string => state.rename.get("current");

/*
 * Is File currently in rename state?
 */
export const isFileRenaming = (state: any, path: string): boolean => {
  return getCurrent(state) == path;
};

// export const getRenamingForDirectory = (state, path) => {
//   if(path == nodePath.dirname(state.rename.get('current'))) {
//     return nodePath.basename( state.rename.get('current') )
//   } else {
//     return null
//   }
// }
