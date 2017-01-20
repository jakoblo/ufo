// https://github.com/electron/electron-compile

var path = require('path')
var appRoot = path.join(__dirname, '../../');

require('electron-compile').init(
  appRoot, // Root of the app with package.json
  path.join(appRoot+'./src/js/main.js') // start for electron main process, relative to here
);