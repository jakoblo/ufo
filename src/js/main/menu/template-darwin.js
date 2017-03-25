//@flow

import { app } from "electron";

export default function getDarwinMenu(): Object {
  var name = require("electron").app.getName();
  return {
    label: name,
    submenu: [
      {
        label: "About " + name,
        role: "about"
      },
      {
        type: "separator"
      },
      {
        label: "Preferences",
        accelerator: "Command+,",
        role: "preferences",
        click: function() {}
      },
      {
        type: "separator"
      },
      {
        label: "Services",
        role: "services",
        submenu: []
      },
      {
        type: "separator"
      },
      {
        label: "Hide " + name,
        accelerator: "Command+H",
        role: "hide"
      },
      {
        label: "Hide Others",
        accelerator: "Command+Alt+H",
        role: "hideothers"
      },
      {
        label: "Show All",
        role: "unhide"
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: function() {
          app.quit();
        }
      }
    ]
  };
}
