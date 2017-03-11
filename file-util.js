const fs = require('fs');

function readFile(pathToFile, callback) {
  fs.open(pathToFile, 'r', (err, fd) => {
    if (err) {
      return callback(err);
    }

    fs.readFile(fd, (err, data) => {
      if (err) {
        return callback(err);
      }

      fs.close(fd, () => {});

      return callback(false, data);
    })
  });
}

function writeFile(pathToFile, data, callback) {
  fs.open(pathToFile, 'w', (err, fd) => {
    if (err) {
      return callback(err);
    }

    fs.write(fd, data, (err, written, string) => {
      if (err) {
        return callback(err);
      }

      fs.close(fd, () => {});

      callback(false);
    });
  });
}

function validatePath(path, callback) {
  fs.stat(path, (err, stats) => {
    if (err) {
      if (err.code == 'ENOENT') {
        fs.mkdir(path, (err) => {
          if (err) {
            return callback(err);
          }

          return callback(false);
        });
      } else {
        return callback(err);
      }
    }

    return callback(false);
  });
}

function exists(path, callback) {
  fs.stat(path, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return callback(false, false);
      }
      return callback(err);
    }

    return callback(false, true);
  })
}

function isFileSync(path) {
  try {
    var stats = fs.statSync(path);
    return stats.isFile();
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    } else {
      return console.log(err);
    }
  }
}

module.exports = {
  readFile: readFile,
  writeFile: writeFile,
  validatePath: validatePath,
  exists: exists,
  isFileSync: isFileSync
}
