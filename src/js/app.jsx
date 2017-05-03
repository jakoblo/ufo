//@flow

/**
 * @file Start of every Window, setup react & redux
 */

import React from "react";
import ReactDOM from "react-dom";
import { storeSetup } from "./store-setup";

// React Components
import { Provider } from "react-redux";
import EventCatcher from "./shortcuts/components/root-event-catcher";
import Navbar from "./navbar/navbar-index";
import ViewPlacer from "./view-placer/vp-index";
import AddonBar from "./addon-bar/components/addon-bar";
import * as Storage from "./utils/storage";

const store = storeSetup();
export const getStore = () => store;

// Load all settings from user app settings
Storage.loadAll(store.dispatch);

// Save all Storage Tasks on window close or reload
window.onbeforeunload = function(e) {
  Storage.saveAll(store.getState());
};

// Console Debug helper, why not? :P
window.store = store;

ReactDOM.render(
  <Provider store={store}>
    <EventCatcher>
      <Navbar.components.parent />
      <ViewPlacer.components.parent />
      <AddonBar />
    </EventCatcher>
  </Provider>,
  document.getElementById("app")
);
