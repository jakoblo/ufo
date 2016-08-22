import * as actions from './app-actions'
import Actionbar from './components/actionbar'
import reducer from './app-reducer'
import * as constants from './app-constants'

const components = {
    actionbar: Actionbar
}

export default { actions, constants, components, reducer };
