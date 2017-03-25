//@flow
import ViewPlacer from "./components/view-placer";
import * as constants from "./vp-constants";

// Changed ViewPlacer to ViewPlacerEditor for better Slate.js testing
const components = {
  parent: ViewPlacer
};

export default { components, constants };
