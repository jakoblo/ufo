"use strict"
import { app, BrowserWindow, ipcMain, dialog, Menu, MenuItem } from 'electron'
import { fs } from 'fs'
import setupShortcuts from './shortcuts/sc-main.js'

const appBasePath = __dirname
var allBrowserWindows = []

function createNewBrowserWindow() {
  let windowID = null

  let browserWindow = new BrowserWindow({
          width : 800,
          height: 600,
          resizable: true,
          frame: true
        });
  windowID = browserWindow.id

  browserWindow.loadURL('file://' + appBasePath + '/../html/window.html');
  setupShortcuts(browserWindow)
  
  // Develop Help
  browserWindow.toggleDevTools()
  browserWindow.maximize()

  // Emitted when the window is closed.
  browserWindow.on('closed', () => {
    allBrowserWindows.splice(allBrowserWindows.indexOf(browserWindow), 1)
    // Dereference the window object, usually you would store windows in an array if your app supports multi windows, this is the time when you should delete the corresponding element.
    browserWindow = null; // does that work?
    
  })

  allBrowserWindows.push(browserWindow)
}
// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit()
});

app.on('before-quit', function(e) {
  if(allBrowserWindows.length > 0) {
    e.preventDefault()
    for (let index = 0; index < allBrowserWindows.length; index++) {
      let bw = allBrowserWindows[index];
      bw.webContents.send('saveState')
    }
  }
});

app.on('ready', function() {
  loadApplicationMenu()
  createNewBrowserWindow()
});

ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: appBasePath + '/../themes/default/img/multiDragPlaceholder.png'
  })
})

ipcMain.on('closeWindow', function(event, bwid) {
    let bw = BrowserWindow.fromId(bwid)
    bw.close()
})

ipcMain.on('writeFile', function(event, path, content) {
  console.log('writeFile: '+path);
  let pathObj = Utils.Path.createPathObj(path)

  fs.access(pathObj.dir, (error) => {
      if(!error) {
        fs.writeFileSync(path, content)
      } else {
        console.log(error)
      }
    }
  )
})

ipcMain.on('global.newWindow', function(event, path) {
  console.log('global.ipcMain.newWindow: '+path);
    createNewBrowserWindow()
})

function loadApplicationMenu() {
  var template = [
    {
    label: 'File',
    submenu: [
      {
        label: 'New Window',
        accelerator: 'CmdOrCtrl+N',
        click: function(item, focusedWindow) {
          createNewBrowserWindow()
        }
      },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.reload();
        }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (function() {
          if (process.platform == 'darwin')
            return 'Ctrl+Command+F';
          else
            return 'F11';
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (function() {
          if (process.platform == 'darwin')
            return 'Alt+Command+I';
          else
            return 'Ctrl+Shift+I';
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.toggleDevTools();
        }
      },
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
    ]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: function() { require('electron').shell.openExternal('http://electron.atom.io') }
      },
    ]
  },
];
if (process.platform == 'darwin') {
  var name = require('electron').app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Preferences',
        accelerator: 'Command+,',
        role: 'preferences',
        click: function() {

         }
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() { app.quit(); }
      },
    ]
  });
  // Window menu.
  template[3].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  );
}


  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
