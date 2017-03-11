const Window = require('./window/window');
const path = require('path');
const File = require('./file-util');

var currentProject;
var currentProjectName;

var currentConfigPath;

var currentProjectConfig = false;

function updateProjectVars(callback) {
  currentProjectName = path.parse(getCurrentProject()).name;

  currentConfigPath = path.join(getCurrentProject(), '.peak');
  File.validatePath(currentConfigPath, (err) => {
    if (err) {
      return callback(err);
    }

    var configFile = path.join(currentConfigPath, 'project.json');
    File.exists(configFile, (err, exists) => {
      if (err) {
        return callback(err);
      }
      if (exists) {
        File.readFile(configFile, (err, data) => {
          if (err) {
            return callback(err);
          }

          currentProjectConfig = JSON.parse(data);
          return callback(false);
        });
      } else {
        createConfig(configFile);
        return callback(false);
      }
    });
  });
}

function createConfig(configFilePath) {
  currentProjectConfig = {
    levels: [],
    currentLevel: null
  }

  File.writeFile(configFilePath, JSON.stringify(currentProjectConfig), (err) => {
    if (err) {
      return console.log(err);
    }
  });
}

function setCurrentProject(projectDir) {
  currentProject = projectDir;

  updateProjectVars((err) => {
    if (err) {
      console.log(err);
    }

    sendUpdate();
  });
}

function getCurrentProject() {
  return currentProject;
}

function getLevelPath() {
  return path.join(currentProject, 'levels');
}

function getAssetsPath() {
  return path.join(currentProject, 'assets');
}

function getCurrentLevel(callback) {
  if (currentProjectConfig) {
    if (currentProjectConfig.currentLevel != null) {
      var currentLevel = currentProjectConfig.levels[currentProjectConfig.currentLevel];
      File.readFile(path.join(getLevelPath(), currentLevel + '.level'), (err, data) => {
        if (err) {
          return callback(err);
        }

        return callback(false, JSON.parse(data));
      });
    }
  } else {
    createConfig(path.join(currentConfigPath, 'project.json'));
  }
  return callback(false, false);
}

function addAndSetCurrentLevel(level) {
  if (currentProjectConfig) {
    currentProjectConfig.levels.push(level);
    currentProjectConfig.currentLevel = currentProjectConfig.levels.length - 1;

    File.writeFile(path.join(currentConfigPath, 'project.json'), JSON.stringify(currentProjectConfig), (err) => {
      if (err) {
        return console.log(err);
      }

      sendUpdate();
    });
  } else {
    createConfig(path.join(currentConfigPath, 'project.json'));
  }
}

function saveProject() {
  if (currentProjectConfig) {
    File.write(path.join(currentConfigPath, 'project.json'), JSON.stringify(currentProjectConfig), (err) => {
      if (err) {
        return console.log(err);
      }
    });
  }
}

function writeLevel(level, callback) {
  if (currentProjectConfig && currentProjectConfig.currentLevel != null) {
    var currentLevel = currentProjectConfig.levels[currentProjectConfig.currentLevel];
    File.writeFile(path.join(getLevelPath(), currentLevel + '.level'), JSON.stringify(level), (err) => {
      if (err) {
        return callback(err);
      }
      return callback(false);
    });
  }
}

function sendUpdate() {
  getCurrentLevel((err, level) => {
    if (err) {
      return console.log(err);
    }
    if (level) {
      Window.send('update', {
        function: 'level',
        args: level
      });
    }
  });
}

module.exports = {
  setCurrentProject: setCurrentProject,
  getCurrentProject: getCurrentProject,
  getLevelPath: getLevelPath,
  getAssetsPath: getAssetsPath,
  getCurrentLevel: getCurrentLevel,
  addAndSetCurrentLevel: addAndSetCurrentLevel,
  saveProject: saveProject,
  writeLevel: writeLevel,
  sendUpdate: sendUpdate
}
