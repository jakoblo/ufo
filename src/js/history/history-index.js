import * as actions from './history-actions'
import Buttons from './components/history-buttons'
import reducer from './history-reducer'
import * as constants from './history-constants'
import * as actiontypes from './history-actiontypes'

const components = {
    Buttons: Buttons
}

export default { actions, actiontypes, constants, components, reducer };
