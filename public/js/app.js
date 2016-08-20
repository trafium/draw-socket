var uicontext;
var context;
var socket;

function setStrokeStyle(color, width) {
  context.strokeStyle = color;
  context.lineWidth = width;
  drawCursor(null, context.lineWidth/2+1);
}

function getMouseCoords(canvas, event) {
  var rectangle = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rectangle.left,
    y: event.clientY - rectangle.top
  };
}

function drawLine(line) {
  context.save();
  context.strokeStyle = line.color;
  context.lineWidth = line.width;
  context.beginPath();
  context.moveTo(line.a.x, line.a.y);

  context.lineTo(line.b.x, line.b.y);
  context.stroke();
  context.restore();
}

var drawCursor = (function() {
  var savedCoords;
  return function (coords, radius) {
    savedCoords = coords || savedCoords;
    uicontext.clearRect(0, 0, uicontext.canvas.width, uicontext.canvas.height);
    uicontext.beginPath();
    uicontext.arc(savedCoords.x, savedCoords.y, radius, 0, 2*Math.PI);
    uicontext.stroke();
  }
})();

function drawAsync(lines, stepNumber) {
  function draw() {
    var step = lines.splice(0, stepNumber);
    step.forEach((line) => {
      drawLine(line);
    });
    if (lines.length) {
      setTimeout(draw, 1);
    }
  }
  draw();
}

function clear() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function initSocket() {
  socket = io.connect();

  socket.on('getCurrentImage', function(url) {
    // drawAsync(context, lines, 100);
    var image = new Image();
    image.src = url;
    context.drawImage(image, 0, 0);
  });

  socket.on('getLine', function(line) {
    console.log('Got line');
    drawLine(line);
  });

  socket.on('clear', function() {
    clear();
  });
}

$(function() {

  var $canvas = $('#canvas');
  var $ui = $('#ui');

  context = $canvas.get(0).getContext('2d');
  uicontext = $ui.get(0).getContext('2d');

  var dragging = false;

  var image = '';

  context.strokeStyle = "black";
  context.lineWidth = 2;
  context.lineCap = "round";

  var line = {};

  $ui.on('mousedown', function(event) {
    $canvas.trigger('mousedown');
  });

  $canvas.on('mousedown', function(event) {
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
    drawCursor(coords, context.lineWidth/2+2);

  });

  $(document).on('mouseup', function(event) {
    dragging = false;

    socket.emit('postCurrentImage', $canvas.get(0).toDataURL());
  });

  $(document).on('keydown', function(event) {

    switch(event.keyCode) {
      case 49: {
        setStrokeStyle("#000000", 2);
        break;
      }
      case 50: {
        setStrokeStyle("#ff0000", 2);
        break;
      }
      case 51: {
        setStrokeStyle("#00ff00", 2);
        break;
      }
      case 52: {
        setStrokeStyle("#0000ff", 2);
        break;
      }
      case 53: {
        setStrokeStyle("#ffffff", 10);
        break;
      }
      default: {

        break;
      }
    }
  });

  initSocket();
  
});
