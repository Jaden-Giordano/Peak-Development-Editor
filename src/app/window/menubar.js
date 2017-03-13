const Actions = require('../actions');

module.exports = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Project',
        accelerator: 'CmdOrCtrl+Shift+n',
        click: Actions.newProject
      },
      {
        label: 'Open Project',
        accelerator: 'CmdOrCtrl+Shift+o',
        click: Actions.openProject
      },
      {
        label: 'Save Project',
        accelerator: 'CmdOrCtrl+Shift+s',
        click: Actions.saveProject
      },
      {
        type: 'separator'
      },
      {
        label: 'New Level',
        click: Actions.createLevel
      },
      {
        type: 'separator'
      },
      {
        label: 'Exit',
        role: 'close'
      }
    ]
  }
];
