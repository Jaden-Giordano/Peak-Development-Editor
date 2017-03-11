const {
  ipcRenderer
} = require('electron');
const {
  dialog
} = require('electron').remote;
const path = require('path');

var currentLevel = null;

ipcRenderer.on('prompt', function(event, args) {
  if (args.function === 'new-project') {
    newProjectModal(function(err, name, dir) {
      event.sender.send('return', {
        function: 'new-project',
        err: err,
        args: {
          name: name,
          dir: dir
        }
      });
    });
  } else if (args.function === 'new-level') {
    newLevelModal(function(err, name) {
      event.sender.send('return', {
        function: 'new-level',
        err: err,
        args: name
      });
    });
  }
});

ipcRenderer.on('update', function(event, args) {
  if (args.function === 'level') {
    var level = args.args;
    if (level) {
      var explorer = $('#project-explorer');
      explorer.empty();
      level.objects.forEach(function(item) {
        explorer.append('<ul id="objects"></ul>')
        var objects = explorer.find('#objects');
        objects.append(parseFMString('<li><a id="?">?</a></li>', [item.name + '' + item.id, item.name]));
        objects.find('#' + item.name + '' + item.id).click(function() {
          var inspector = $('#inspector');
          inspector.empty();
          if (item.components) {
            item.components.forEach(pushComponentToInspector.bind(null, item));
          }
          // Add Component Button
          inspector.append('<div class="row"><div id="add-component-dropdown" class="dropdown col-sm-12"></div></div>');
          var dropdownDiv = inspector.find('#add-component-dropdown');
          dropdownDiv.append(parseFMString('<button type="button" id="add-component-?" class="btn btn-default dropdown-toggle col-sm-12" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Add Component</button>', [item.id]))
          dropdownDiv.append(parseFMString('<ul class="dropdown-menu" aria-labelledby="add-component-?"></ul>', [item.id]));
          var dropdownMenu = dropdownDiv.find('ul');
          dropdownMenu.append('<li><a href="#" id="add-material-component">Material Component</a></li>');
          dropdownMenu.find('#add-material-component').click(function() {
            ipcRenderer.send('object-change', {
              function: 'add-component',
              err: false,
              args: {
                object: item.id,
                component: 'material-component'
              }
            });
          });
        });
      });
    }
  }
});

function pushComponentToInspector(object, component) {
  var inspector = $('#inspector');
  if (component) {
    inspector.append(parseFMString('<div id="?" class="component"></div>', [component.name]));
    var componentDiv = inspector.find('#' + component.name);
    componentDiv.append(parseFMString('<span class="componentName">?</span>', [component.name]));
    if (component.properties) {
      component.properties.forEach(pushPropertyToComponent.bind(null, componentDiv, component, object));
    }
  }
}

function pushPropertyToComponent(componentDiv, component, object, property, index) {
  componentDiv.append(parseFMString('<div id="?" class="property row"></div>', [property.name]));
  var propertyDiv = componentDiv.find('#' + property.name);
  propertyDiv.append(parseFMString('<span class="propertyName col-sm-12 center-align">?</span>', [property.name]));
  if (property.values && property.values.length > 0) {
    var colSize = Math.floor(12 / property.values.length);
    property.values.forEach(function(value, vIndex) {
      propertyDiv.append(parseFMString('<div class="col-xs-?"><div id="?" class="input-group"></div></div>', [colSize, property.name + '-value-' + value.name]));
      var propertyValueDiv = propertyDiv.find('#' + property.name + '-value-' + value.name);
      propertyValueDiv.append(parseFMString('<span class="input-group-addon">?:</span>', [value.name]));
      propertyValueDiv.append(parseFMString('<input type="text" class="col-xs-12" id="?" value="?" />', [property.name + '-value-' + value.name + '-input', value.value]));
      var propertyValueInput = propertyValueDiv.find('#' + property.name + '-value-' + value.name + '-input');
      propertyValueInput.on('input', function(e) {
        if ($(this).data("lastval") != $(this).val()) {
          $(this).data("lastval", $(this).val());
          var value = $(this).val();
          if (property.type === 'vector2' || property.type === 'number') {
            if (!isNaN(value)) {
              ipcRenderer.send('object-change', {
                function: 'edit-object',
                err: false,
                args: {
                  object: object.id,
                  component: component.id,
                  propertyIndex: index,
                  valueIndex: vIndex,
                  value: Number(value)
                }
              });
            }
          } else if (property.type === 'string') {
            ipcRenderer.send('object-change', {
              function: 'edit-object',
              err: false,
              args: {
                object: object.id,
                component: component.id,
                propertyIndex: index,
                valueIndex: vIndex,
                value: value
              }
            });
          }
        };
      });
    });
  }
}

function parseFMString(fmstring, fmvars) {
  var nString = fmstring;
  fmvars.forEach(function(fmvar) {
    nString = nString.replace('\?', fmvar);
  });
  return nString;
}

document.getElementById('new-object').onclick = function() {
  ipcRenderer.send('toolbar', {
    function: 'new-object',
    err: false
  });
}

document.getElementById('save-project').onclick = function() {
  ipcRenderer.send('toolbar', 'save-project');
}

function newProjectModal(callback) {
  let modal = document.getElementById('new-project-prompt');
  modal.querySelector('.openDir').onclick = function() {
    dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    }, function(filePaths) {
      modal.querySelector('#projectDir').value = filePaths[0];
    });
  }
  createModal(modal, function() {
    var projectName = modal.querySelector('#projectName').value;
    var projectDir = modal.querySelector('#projectDir').value;

    callback(false, projectName, projectDir);

    modal.querySelector('#projectName').value = '';
    modal.querySelector('#projectDir').value = '';
    //callback(false, modal.querySelector('#name').value, modal.querySelector('#dir').value);
  });
}

function newLevelModal(callback) {
  let modal = document.getElementById('new-level-prompt');
  createModal(modal, function() {
    var levelName = modal.querySelector('#levelName').value;
    callback(false, levelName);
  });
}

function createModal(modal, callback) {
  modal.style.display = 'block';

  modal.querySelector('.close').onclick = function() {
    modal.style.display = 'none';
  }

  modal.querySelector('.submit').onclick = function() {
    modal.style.display = 'none';

    callback();
  }
}
