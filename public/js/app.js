$(function() {

  function initSocket() {
    socket = io.connect();

    socket.on('getCurrentImage', function(url) {
      // drawAsync(context, lines, 100);
      console.log(url);
      var image = new Image();
      image.src = url;
      context.drawImage(image, 0, 0);
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

  $(document).on('mousemove', function(event) {
    if (dragging) {
      coords = getMouseCoords($canvas.get(0), event);

      line.b = coords;
      drawLine(context, line);
      socket.emit('postLine', line);
      line.a = coords;
    }
  });

  $(document).on('mouseup', function(event) {
    dragging = false;

    socket.emit('postCurrentImage', $canvas.get(0).toDataURL())
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

function drawAsync(context, lines, stepNumber) {
  function draw() {
    var step = lines.splice(0, stepNumber);
    step.forEach((line) => {
      drawLine(context, line);
    });
    if (lines.length) {
      setTimeout(draw, 1);
    }
  }
  draw();
}