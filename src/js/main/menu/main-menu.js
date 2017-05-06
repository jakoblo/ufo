//@flow

/**
 * @file sets the Appliaction Menu Edit, View, Window etc..
 * https://github.com/electron/electron/blob/master/docs/api/menu.md
 */

import { Menu } from "electron";
import getGeneralTemplate from "./template-general";
import getDarwinTemplate from "./template-darwin";

export default function loadAppMenu() {
  let template = getGeneralTemplate();
  if (process.platform == "darwin") {
    template.push(getDarwinTemplate());
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
