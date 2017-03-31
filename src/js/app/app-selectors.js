//@flow
/**
 * @param {State} state
 * @returns {Array}
 */
export const getHistorySequence = (state: any) =>
  state.app.getIn(["history", "sequence"]);

/**
 * @param {State} state
 * @returns {number}
 */
export const getHistoryPosition = (state: any): number =>
  state.app.getIn(["history", "position"]);

export const getCurrentFolders = (
  state: any
):
  | {
      from: string,
      to: string
    }
  | boolean => {
  const historyPosition = getHistoryPosition(state);
  const from = state.app.getIn([
    "history",
    "sequence",
    historyPosition,
    "from"
  ]);
  const to = state.app.getIn(["history", "sequence", historyPosition, "to"]);

  if (from && to) {
    return { from, to };
  } else {
    return false;
  }
};

/**
 * @param {State} state
 * @returns {string}
 */
export const getDisplayType = (state: any): string =>
  state.app.get("displayType");

/**
 * @param {State} state
 * @param {string} path
 * @returns {Map}
 */
export const getViewSettings = (state: any, path: string): Map<string, *> =>
  state.app.getIn(["viewSettings", path]);
