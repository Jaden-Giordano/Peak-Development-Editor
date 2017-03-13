const BOTTOM_PANE_HEIGHT = 150;

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  let toolbarHeight = $('.toolbar').innerHeight();

  const topHeight = height - toolbarHeight - BOTTOM_PANE_HEIGHT;
  $('.top-content').height(topHeight);

  const lvEditorWidth = $('#level-editor').innerWidth();
  const lvEditorHeight = $('#level-editor').innerHeight();

  let editorCanvas = $('#level-editor-canvas');
  editorCanvas.attr('width', lvEditorWidth);
  editorCanvas.attr('height', lvEditorHeight);
}

resize();
window.onresize = resize;
