//@flow

import * as actions from "./filter-actions";
import * as actiontypes from "./filter-actiontypes";
import * as constants from "./filter-constants";
import reducer from "./filter-reducer";
import * as selectors from "./filter-selectors";
import filterTypeInput from "./components/filter-type-input";

const components = {
  filterTypeInput: filterTypeInput
};

export default {
  actions,
  actiontypes,
  selectors,
  reducer,
  constants,
  components
};
