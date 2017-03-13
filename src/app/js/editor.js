var canvas = document.getElementById('level-editor-canvas');
var ctx = canvas.getContext('2d');

var level = false;

ipcRenderer.on('update', function(event, args) {
  if (args.function === 'level') {
    if (args.args) {
      level = args.args;
    }
  }
});

setInterval(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (level) {
    level.objects.forEach(function(object) {
      let x = 0, y = 0, scaleX = 1, scaleY = 1;
      let image = false;

      object.components.forEach(function(component) {
        if (component.id === 0) {
          component.properties.forEach(function(property) {
            if (property.name === 'position') {
              property.values.forEach(function(value) {
                if (value.name === 'x') {
                  x = value.value;
                } else if (value.name === 'y') {
                  y = value.value;
                }
              });
            } else if (property.name === 'scale') {
              property.values.forEach(function(value) {
                if (value.name === 'x') {
                  scaleX = value.value;
                } else if (value.name === 'y') {
                  scaleY = value.value;
                }
              });
            }
          });
        } else if (component.name === 'Material') {
          var imgSrc = image = ipcRenderer.sendSync('get', {
            function: 'assets-path',
            err: false,
            args: component.properties[0].values[0].value
          });
          if (imgSrc) {
            image = new Image();
            image.src = imgSrc;
          }
        }
      });


      if (image) {
        ctx.drawImage(image, x, y, scaleX, scaleY);
      } else {
        ctx.fillStyle = '#fff';
        ctx.fillRect(x, y, scaleX, scaleY);
      }
    });
  }
}, ~~(1000/30));
