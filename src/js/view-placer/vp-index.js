// import * as actions from './viewcontainer-actions'
import ViewPlacer from './components/view-placer'
import ViewPlacerEditor from './components/view-placer-for-editor'
import ViewWrapper from './components/view-wrapper'
import * as constants from './vp-constants'

// Changed ViewPlacer to ViewPlacerEditor for better Slate.js testing
const components = {
  parent: ViewPlacerEditor,
  child: ViewWrapper
}

export default { components, constants };