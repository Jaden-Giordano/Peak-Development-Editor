const {
  ipcMain
} = require('electron');
const path = require('path');
const fs = require('fs');
const Window = require('./window/window');
const State = require('./states');
const File = require('./file-util');

function newProject() {
  Window.send('prompt', {
    function: 'new-project',
    args: false
  });

  ipcMain.once('return', (event, args) => {
    if (args.function === 'new-project') {
      if (args.err) {
        console.log(args.err.info);
      }

      var projectName = args.args.name;
      var projectDir = args.args.dir;

      const projectPath = path.join(projectDir, projectName);

      File.validatePath(projectPath, (err) => {
        if (err) {
          console.log(err);
        }

        console.log('Creating project: ' + projectName + ' (' + projectDir + ')');
        State.setCurrentProject(projectPath);
      });
    }
  });
}

function openProject() {
  Window.createOpenDirDialog((err, fileNames) => {
    if (err) {
      console.log(err);
    }

    if (fileNames.length > 0) {
      const projectPath = fileNames[0];

      fs.stat(projectPath, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT') {
            Window.showDialog('Project does not exist');
            return;
          }
        }

        State.setCurrentProject(projectPath);
      });
    }
  });
}

function createLevel() {
  Window.send('prompt', {
    function: 'new-level'
  });
  ipcMain.once('return', (event, args) => {
    if (args.function === 'new-level') {
      if (args.err) {
        return console.log(args.err);
      }

      var name = args.args;

      File.validatePath(State.getLevelPath(), (err) => {
        if (err) {
          console.log(err);
        }

        var levelPath = path.join(State.getLevelPath(), name + '.level');

        var level = {
          objects: []
        };

        File.writeFile(levelPath, JSON.stringify(level), (err) => {
          if (err) {
            console.log(err);
          }

          State.addAndSetCurrentLevel(name);
        });
      });
    }
  });
}

function saveProject() {
  State.saveProject();
}

function editObjectProperty(objectID, componentID, propertyIndex, valueIndex, value) {
  State.getCurrentLevel((err, level) => {
    if (err) {
      return console.log(err);
    }

    if (level && level.objects) {
      level.objects.forEach((object) => {
        if (object.id === objectID && object.components) {
          object.components.forEach((component) => {
            if (component.id === componentID && component.properties) {
              var property = component.properties[propertyIndex];
              if (property.values) {
                if (property.values[valueIndex]) {
                  property.values[valueIndex].value = value;
                  State.writeLevel(level, (err) => {
                    if (err) {
                      return console.log(err);
                    }

                    State.sendUpdate();
                  });
                }
              }
            }
          });
        }
      });
    }
  });
}

function addObject() {
  State.getCurrentLevel((err, level) => {
    if (err) {
      return console.log(err);
    }

    if (level && level.objects) {
      var object = {
        id: level.objects.length,
        name: 'object',
        components: [{
          id: 0,
          name: 'Transform',
          properties: [{
            name: 'position',
            type: 'vector2',
            values: [{
              name: 'x',
              value: 0
            }, {
              name: 'y',
              value: 0
            }]
          }, {
            name: 'rotation',
            type: 'number',
            values: [{
              name: 'rotation',
              value: 0
            }]
          }, {
            name: 'scale',
            type: 'vector2',
            values: [{
              name: 'x',
              value: 0
            }, {
              name: 'y',
              value: 0
            }]
          }]
        }]
      }

      level.objects.push(object);
      State.writeLevel(level, (err) => {
        if (err) {
          return console.log(err);
        }

        State.sendUpdate();
      })
    }
  });
}

function addComponent(objectID, componentName) {
  State.getCurrentLevel((err, level) => {
    if (err) {
      return console.log(err);
    }

    if (level && level.objects) {
      level.objects.forEach((object) => {
        if (object.id === objectID) {
          if (object.components) {
            if (componentName == 'material-component') {
              var component = {
                id: object.components.length,
                name: 'Material',
                properties: [{
                    name: 'image',
                    type: 'string',
                    values: [{
                      name: 'file',
                      value: ''
                    }]
                  }
                ]
              }
              object.components.push(component);
              State.writeLevel(level, (err) => {
                if (err) {
                  return console.log(err);
                }

                State.sendUpdate();
              });
            }
          }
        }
      })
    }
  });
}

module.exports = {
  newProject: newProject,
  openProject: openProject,
  createLevel: createLevel,
  saveProject: saveProject,
  editObjectProperty: editObjectProperty,
  addObject: addObject,
  addComponent: addComponent
}
