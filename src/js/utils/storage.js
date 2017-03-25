//@flow
import storage from "electron-json-storage";
import { Map, List } from "immutable";
import { remote } from "electron";
import drivelist from "drivelist";
import fs from "../filesystem/watch/fs-watch-index";
import Navbar from "../navbar/navbar-index";

export function loadStatefromStorage(windowID: number, callback: Function) {
  storage.get("lastState" + windowID, function(error, data) {
    if (error) throw error;
    callback(data);
  });
}

export function loadNavbarfromStorage(callback: Function) {
  storage.get("navbar", function(error, data) {
    if (error) {
      data = loadDefaultUserFolders();
      console.error(error);
    } else if (data.groupItems == undefined) {
      data = loadDefaultUserFolders();
    }

    callback(data);
  });
}

export function saveStatetoStorage(
  currentState: any,
  bwid: number,
  callback: Function
) {
  saveFavbartoStorage(currentState, function() {
    storage.set("lastState" + bwid, currentState, function(error) {
      if (error) throw error;
      callback();
    });
  });
}

export function saveFavbartoStorage(currentState: any, callback?: Function) {
  console.log("SAVEFAVBAR");
  storage.set("navbar", currentState.navbar, function(error) {
    if (error) throw error;
    callback && callback();
  });
}

function loadDefaultUserFolders() {
  const app = remote.app;
  let navgroup = {
    title: "Favourites",
    items: [
      app.getPath("home"),
      app.getPath("desktop"),
      app.getPath("documents"),
      app.getPath("downloads"),
      app.getPath("music"),
      app.getPath("pictures"),
      app.getPath("videos")
    ]
  };
  let navbar = { groupItems: [navgroup] };
  return navbar;
}

/**
 * Returns an Array of Path Strings
 */
export function loadSystemVolumes(
  fileAdd: Function,
  fileUnlink: Function,
  fileChange: Function,
  watcherReady: Function
) {
  const watcherSettings = {
    ignored: /[\/\\]\./,
    persistent: true,
    depth: 0,
    alwaysStat: true
  };

  if (process.platform == "darwin") {
    fs.watchhandler.watch(
      "/Volumes/",
      watcherSettings,
      fileAdd,
      fileUnlink,
      fileChange,
      wready,
      (path, error) => {
        console.error(path, error);
      }
    );

    function wready(path, files) {
      let items = [];
      for (var key in files) {
        // skip loop if the property is from prototype
        if (!files.hasOwnProperty(key)) continue;
        var obj = files[key];
        items.push(obj.path);
      }
      watcherReady(Navbar.constants.DISKS_GROUP_NAME, items);
    }
  }
  drivelist.list(function(error, disks) {
    if (error) throw error;
    // console.log(disks);
  });
}
