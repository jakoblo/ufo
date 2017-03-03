
/**
 * @param {State} state
 * @returns {Array}
 */
export const getHistorySequence = (state) => state.app.getIn(['history', 'sequence']);

/**
 * @param {State} state
 * @returns {number}
 */
export const getHistoryPosition = (state) => state.app.getIn(['history', 'position']);

/**
 * @param {State} state
 * @returns {string}
 */
export const getDisplayType = (state) => state.app.get('displayType');

/**
 * @param {State} state
 * @param {string} path
 * @returns {Map}
 */
export const getViewSettings = (state, path) => state.app.getIn(['viewSettings', path]);