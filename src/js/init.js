/**
 * @file initalisazion file for electron-compile, to start ES & Less compile. 
 * Linked in ../../package.json 
 * https://github.com/electron/electron-compile 
 * @author bunterWolf
 */

var path = require('path')
var appRoot = path.join(__dirname, '../../');

require('electron-compile').init(
  appRoot, // Root of the app with package.json
  path.join(appRoot+'./src/js/main/main.js') // start for electron main process, relative to here
);