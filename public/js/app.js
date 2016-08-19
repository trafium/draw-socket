$(function() {
  function initSocket() {
    socket = io.connect();

    socket.on('getCurrentDrawing', function(lines) {
      lines.forEach((line) => {
        drawLine(context, line);
      });
    });

    socket.on('getLine', function(line) {
      console.log(line.a, line.b);
      drawLine(context, line);
    });
  }

  var $canvas = $('#canvas');
  var context = $canvas.get(0).getContext('2d');
  var dragging = false;
  var socket = true;

  context.strokeStyle = "black";

  var line = {};

  $canvas.on('mousedown', function(event) {
    dragging = true;

    coords = getMouseCoords(this, event);

    line.a = coords;
  });
  $canvas.on('mousemove', function(event) {
    if (dragging) {
      coords = getMouseCoords(this, event);

      line.b = coords;
      drawLine(context, line);
      socket.emit('postLine', line);
      line.a = coords;
    }
  });
  $(document).on('mouseup', function(event) {
    dragging = false;
  });

  initSocket();

  
});

function getMouseCoords(canvas, event) {
  var rectangle = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rectangle.left,
    y: event.clientY - rectangle.top
  };
}

function drawLine(context, line) {
  context.beginPath();
  context.moveTo(line.a.x, line.a.y);

  context.lineTo(line.b.x, line.b.y);
  context.stroke();
}
