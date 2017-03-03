import * as c from  './config-constants'

/**
 * @param {State} state
 * @returns {boolean}
 */
export const getReadOnlyState = (state) => state[c.NAME].get('readOnly')
