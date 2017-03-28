//@flow
import storage from "electron-json-storage";
import { Map, List } from "immutable";
import fs from "../filesystem/watch/fs-watch-index";
import Navbar from "../navbar/navbar-index";

/**
 * Returns an Array of Path Strings
 */
// export function loadSystemVolumes(
//   fileAdd: Function,
//   fileUnlink: Function,
//   fileChange: Function,
//   watcherReady: Function
// ) {
//   const watcherSettings = {
//     ignored: /[\/\\]\./,
//     persistent: true,
//     depth: 0,
//     alwaysStat: true
//   };
//
//   if (process.platform == "darwin") {
//     fs.watchhandler.watch(
//       "/Volumes/",
//       watcherSettings,
//       fileAdd,
//       fileUnlink,
//       fileChange,
//       wready,
//       (path, error) => {
//         console.error(path, error);
//       }
//     );
//
//     function wready(path, files) {
//       let items = [];
//       for (var key in files) {
//         // skip loop if the property is from prototype
//         if (!files.hasOwnProperty(key)) continue;
//         var obj = files[key];
//         items.push(obj.path);
//       }
//       watcherReady(Navbar.constants.DISKS_GROUP_NAME, items);
//     }
//   }
//   drivelist.list(function(error, disks) {
//     if (error) throw error;
//     // console.log(disks);
//   });
// }
