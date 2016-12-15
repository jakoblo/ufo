
/**
 * returns array
 */
export const getHistorySequence = (state) => state.app.getIn(['history', 'sequence']);

/**
 * returns number
 */
export const getHistoryPosition = (state) => state.app.getIn(['history', 'position']);