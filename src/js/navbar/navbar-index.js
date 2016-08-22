import * as actions from './navbar-actions'
import Navbar from './components/navbar'
import NavGroup from './components/navgroup'
import reducer from './navbar-reducer'
import * as constants from './navbar-constants'

const components = {
    parent: Navbar,
    navgroup: NavGroup
}

export default {actions, constants, components, reducer };

