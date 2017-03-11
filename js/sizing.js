const TOOLBAR_HEIGHT = 26;
const PANE_WIDTH = 286;
const PANE_HEIGHT = 176;
const BOTTOM_PANE_HEIGHT = TOOLBAR_HEIGHT + PANE_HEIGHT;

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  document.getElementById('project-explorer').style.height = (height - BOTTOM_PANE_HEIGHT) + 'px';

  let levelEditor = document.getElementById('level-editor');
  let lvEWidth = (width - (PANE_WIDTH * 2)), lvEHeight = (height - BOTTOM_PANE_HEIGHT);
  levelEditor.style.width = lvEWidth + 'px';
  levelEditor.style.height = lvEHeight + 'px';
  let levelEditorCanvas = $('#level-editor-canvas');
  levelEditorCanvas.attr('width', lvEWidth);
  levelEditorCanvas.attr('height', lvEHeight);

  document.getElementById('inspector').style.height = (height - BOTTOM_PANE_HEIGHT) + 'px';

  document.getElementById('asset-browser').style.width = ((width-1) / 2) + 'px';

  document.getElementById('console').style.width = ((width-1) / 2) + 'px';
}

document.addEventListener('DOMContentLoaded', function() {
  resize();
});

window.onresize = resize;
