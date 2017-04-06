//@flow

import { createSelector } from "reselect";
import Selection from "../selection/sel-index";
import nodePath from "path";
import { Map } from "immutable";

/*
 * Filter which have to applied for every folder
 */
export const getGlobal = (state: any): any => state.filter.get("global");

/*
 * Local Filter which are currently active for the given Path
 */
export const getLocal = (state: any, path: string): any => {
  let focused = isFocused(state, path);
  return focused ? state.filter.get("focused") : Map({});
};

// export const isHidden = (state: any, path: string): boolean => {
//   const dir = nodePath.dirname(path);
//   const fileName = nodePath.basename(path);
//   const filter = getFiterRegExOfFolder_Factory()(state, dir);
//
//   var hidden = false;
//
//   filter.forEach(filter => {
//     if (!fileName.match(filter)) {
//       hidden = true;
//     }
//   });
//
//   return hidden;
// };

/*
 * The String which the User is currently Filtering for
 */
export const getUserInput = (state: any): string | typeof undefined =>
  state.filter.getIn(["focused", "userInput", "input"]);

/*
 * Focused is the folder where Typing-Filter is applied
 * Which Filter is focused is deciedet in the Filter-Reducer
 */
export const getFocused = (state: any): string =>
  state.filter.get("focusedPath");

/*
 * Focused is the folder where Typing-Filter is applied
 * Which Filter is focused is deciedet in the Filter-Reducer
 */
export const isFocused = (state: any, path: string): boolean =>
  getFocused(state) == path;

/*
 * Factroy for Selector that returns an Array of regular Expressions
 * to filter the files for the given folder
 * This factory is maybe over optimized...
 */
export const getFiterRegExOfFolder_Factory = () => {
  return createSelector([getGlobal, getLocal], (globFilter, localFilter) => {
    return [
      ...globFilter.toIndexedSeq().toJS(),
      ...localFilter.map(entry => entry.get("regEx")).toIndexedSeq().toJS()
    ];
  });
};
