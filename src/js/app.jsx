//@flow

/**
 * @file Start of every Window, setup react & redux
 */

import React from "react";
import ReactDOM from "react-dom";
import { storeSetup } from "./store-setup";
import Config from "./config/config-index";
import { ipcRenderer, remote } from "electron";
import * as Utils from "./utils/utils-index";

// React Components
import { Provider } from "react-redux";
import EventCatcher from "./shortcuts/components/root-event-catcher";
import AppControls from "./app/components/app-controls";
import ReadOnlyToggle from "./app/components/read-only-toggle";
import Sidebar from "./general-components/sidebar";
import Navbar from "./navbar/navbar-index";
import ViewPlacer from "./view-placer/vp-index";
import AddonBar from "./addon-bar/components/addon-bar";

const windowID = remote.getCurrentWindow().id;
const store = storeSetup();

export function getStore() {
  return store;
}

// Console Debug helper, why not?
window.store = store;
window.utils = Utils.storage;

// Store State loading & saving
store.dispatch(Config.actions.loadPreviousState(windowID));
ipcRenderer.on("saveState", function(event) {
  Utils.storage.saveStatetoStorage(store.getState(), windowID, function() {
    ipcRenderer.send("closeWindow", windowID);
  });
});

ReactDOM.render(
  <Provider store={store}>
    <EventCatcher>
      <Sidebar>
        <AppControls />
        <Navbar.components.parent />
        <ReadOnlyToggle />
      </Sidebar>
      <ViewPlacer.components.parent />
      <AddonBar />
    </EventCatcher>
  </Provider>,
  document.getElementById("app")
);
