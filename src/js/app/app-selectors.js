export const getHistorySequence = (state) => state.app.getIn(['history', 'sequence'])
export const getHistoryPosition = (state) => state.app.getIn(['history', 'position'])