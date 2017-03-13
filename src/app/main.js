const {
  app,
  ipcMain,
  Menu
} = require('electron');
const path = require('path');
const Window = require('./window/window');
const Actions = require('./actions');
const State = require('./states');
const File = require('./file-util');

const menu = Menu.buildFromTemplate(require('./window/menubar'));
Menu.setApplicationMenu(menu);

const engineDir = path.join(__dirname, '..', 'Engine');
const assetsDir = path.join(engineDir, 'assets');

var level;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  Window.createWindow();
});

app.on('activate', () => {
  Window.createWindow();
});

ipcMain.on('toolbar', (event, args) => {
  if (args) {
    if (args.err) {
      console.log(err);
      return;
    }

    if (args.function === 'new-object') {
      Actions.addObject();
    } else if (args.function === 'save-project') {
      Actions.saveProject();
    }
  }
});

ipcMain.on('object-change', (event, args) => {
  if (args) {
    if (args.err) {
      return console.log(err);
    }

    if (args.function === 'edit-object') {
      Actions.editObjectProperty(args.args.object, args.args.component, args.args.propertyIndex, args.args.valueIndex, args.args.value);
    } else if (args.function === 'add-component') {
      Actions.addComponent(args.args.object, args.args.component);
    }
  }
});

ipcMain.on('get', (event, args) => {
  if (args) {
    if (args.err) {
      return console.log(err);
    }

    if (args.function === 'assets-path') {
      var assetPath = path.join(State.getAssetsPath(), args.args);
      if (File.isFileSync(assetPath)) {
        event.returnValue = assetPath;
      } else {
        event.returnValue = false;
      }
    }
  }
});
