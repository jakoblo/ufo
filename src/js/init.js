// https://github.com/electron/electron-compile

var path = require('path')
var appRoot = path.join(__dirname, '../../');

require('electron-compile').init(
  appRoot, // Root of the app with package.json
  './main' // start for electron main process, relative to here
);