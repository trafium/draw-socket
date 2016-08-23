var paletteContext
var uiContext;
var context;
var socket;

var $canvas;
var $ui;
var $toolbar;
var $palette;
var $currentColor;
var $brushSizes;

$(function() {

  $canvas = $('#canvas');
  $ui = $('#ui');
  $toolbar = $('#toolbar');
  $palette = $('#color-palette');
  $currentColor = $('#current-color');
  $brushSizes = $('.brush-size');

  var image = '';
  var line = {};
  
  var dragging = false;
  var paletteDragging = false;
  
  context = $canvas.get(0).getContext('2d');
  uiContext = $ui.get(0).getContext('2d');
  paletteContext = $palette.get(0).getContext('2d');

  // DEFAULT STROKE STYLES
  context.strokeStyle = "black";
  context.lineWidth = 2;
  context.lineCap = "round";

  // UI TOUCH EVENTS
  $ui.on('touchstart', function(event) {
    coords = getTouchCoords(this, event);
  });

  // UI MOUSE EVENTS
  $ui.on('mousedown', function(event) {
    dragging = true;
    coords = getMouseCoords(this, event);
    line.a = coords;
  });

  $(document).on('mousemove', function(event) {
    coords = getMouseCoords($canvas.get(0), event);
    if (dragging) {
      line.b = coords;
      line.color = context.strokeStyle;
      line.width = context.lineWidth;
      drawLine(line);
      socket.emit('postLine', line);
      line.a = coords;
    }
    drawCursor(coords, context.lineWidth/2+1);

  });

  $(document).on('mouseup', function(event) {
    if (dragging) {
      socket.emit('postCurrentImage', $canvas.get(0).toDataURL());
    }
    clearSelection();
    dragging = false;
  });

  // BRUSH SIZE SELECTION
  $brushSizes.on('click', function(event) {
    $brushSizes.removeClass('active');
    $(this).addClass('active');
    setStrokeStyle(null, $(this).attr('data-size'));
  });

  // COLOR SELECTION
  $palette.on('mousedown touchstart', function(event) {
    paletteDragging = true;
    setColor(this, event);
  });

  $palette.on('mousemove touchmove', function(event) {
    if (paletteDragging) {
      setColor(this, event);
    }
  });

  $(document).on('mouseup touchend', function(event) {
    paletteDragging = false;
  });

  initColorPalette();
  initSocket();
  
});
