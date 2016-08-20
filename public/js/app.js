$(function() {

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
      drawLine(context, line);
    });
  }

  var $canvas = $('#canvas');
  var context = $canvas.get(0).getContext('2d');
  var dragging = false;
  var socket = true;

  context.strokeStyle = "black";
  context.lineWidth = 2;

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
      line.color = context.strokeStyle;
      line.width = context.lineWidth;
      drawLine(context, line);
      socket.emit('postLine', line);
      line.a = coords;
    }
  });

  $(document).on('mouseup', function(event) {
    dragging = false;

    socket.emit('postCurrentImage', $canvas.get(0).toDataURL())
  });

  $(document).on('keydown', function(event) {
    console.log(event.keyCode);
    switch(event.keyCode) {
      case 49: {
        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        break;
      }
      case 50: {
        context.strokeStyle = "#ff0000";
        context.lineWidth = 2;
        break;
      }
      case 51: {
        context.strokeStyle = "#00ff00";
        context.lineWidth = 2;
        break;
      }
      case 52: {
        context.strokeStyle = "#0000ff";
        context.lineWidth = 2;
        break;
      }
      case 53: {
        context.strokeStyle = "#ffffff";
        context.lineWidth = 10;
        break;
      }
    }
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
  context.save();
  context.strokeStyle = line.color;
  context.lineWidth = line.width;
  context.beginPath();
  context.moveTo(line.a.x, line.a.y);

  context.lineTo(line.b.x, line.b.y);
  context.stroke();
  context.restore();
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