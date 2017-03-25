//@flow
import * as actions from "./vf-actions";
import * as actiontypes from "./vf-actiontypes";
import * as constants from "./vf-constants";
import reducer from "./vf-reducer";
import * as selectors from "./vf-selectors";
import ViewFile from "./components/view-file";

let components = {
  ViewFile: ViewFile
};

export default {
  actions,
  actiontypes,
  selectors,
  reducer,
  constants,
  components
};
