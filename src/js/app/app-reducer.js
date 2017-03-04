import { fromJS, Map } from 'immutable'
import App from '../app/app-index'
import * as c from '../app/app-constants'
import _ from 'lodash'

const INITIAL_STATE = fromJS({
  history: {
    position: null,
    sequence: []
  },
  viewSettings: {},
  displayType: c.DISPLAY_TYPE_COLUMNS
})

export default function appReducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case App.actiontypes.APP_CHANGE_PATH:
      
      if(Number.isInteger(action.payload.historyJump)) {
        
        // History Jump
        return state.setIn(['history', 'position'], action.payload.historyJump)

      } else {

        // Add History Entry to Sequence
        let seq = state.getIn(['history', 'sequence']).splice( state.getIn(['history', 'position']) + 1 )
        seq = seq.push( Map({
          from: _.first(action.payload.pathRoute),
          to: _.last(action.payload.pathRoute)
        }))
        state = state
                  .setIn(['history', 'sequence'], seq)
                  .setIn(['history', 'position'], seq.size -1)
      }

      // create View Settings if necessary
      action.payload.pathRoute.forEach((viewPath) => {
        if(state.getIn(['viewSettings', viewPath])) return // Setting already there
        state = state.setIn( ['viewSettings', viewPath], Map({ type: c.FOLDER_VIEW_EDITOR }) )
      })

      return state
    
    case App.actiontypes.APP_SET_DISPLAY_TYPE:
      return state.set('displayType', action.payload.displayType)
    
    case App.actiontypes.APP_SET_VIEW_TYPE:
      return state.setIn(['viewSettings', action.payload.path, 'type'], action.payload.type)

    default:
      return state;
  }

}
