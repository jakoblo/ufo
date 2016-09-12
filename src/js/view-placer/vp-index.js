// import * as actions from './viewcontainer-actions'
import ViewPlacer from './components/view-placer'
import ViewWrapper from './components/view-wrapper'
import * as constants from './vp-constants'

const components = {
  parent: ViewPlacer,
  child: ViewWrapper
}

export default { components, constants };