const {
  BrowserWindow,
  dialog
} = require('electron');
const path = require('path');
const url = require('url');

let win = null;

function createWindow() {
  if (win === null) {
    win = new BrowserWindow({
      width: 1570,
      height: 720,
      minWidth: 1280,
      minHeight: 720
    });

    win.loadURL(url.format({
      pathname: path.join(__dirname, '..', 'index.html'),
      protocol: 'file:',
      slashes: true
    }));

    win.toggleDevTools();

    win.on('closed', function() {
      win = null;
    });
  }
}

function send(channel, message) {
  win.webContents.send(channel, message);
}

function createOpenDirDialog(callback) {
  dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  }, (filePaths) => {
    callback(false, filePaths);
  })
}

function showDialog(message) {
  dialog.showMessageBox(win, {
    buttons: [],
    message: message
  })
}

module.exports = {
  createWindow: createWindow,
  send: send,
  createOpenDirDialog: createOpenDirDialog,
  showDialog: showDialog
}
