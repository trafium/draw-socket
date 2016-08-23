function initColorPalette() {
  var palettePNG = new Image(32, 270);
  palettePNG.src = 'res/color_palette.png';
  palettePNG.onload = function() {
    paletteContext.drawImage(palettePNG, 0, 0);
  };
}

function setColor(canvas, event) {
  var coords = getMouseCoords(canvas, event);
  var imgData = paletteContext.getImageData(coords.x, coords.y, 1, 1).data;
  var color = 'rgba('+imgData[0]+','+imgData[1]+','+imgData[2]+',1)';
  $currentColor.css({'background-color': color});

  setStrokeStyle(color, null);
}

function setStrokeStyle(color, width) {
  context.strokeStyle = color || context.strokeStyle;
  context.lineWidth = width || context.lineWidth;
  drawCursor(null, context.lineWidth/2+1);
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
    uiContext.clearRect(0, 0, uiContext.canvas.width, uiContext.canvas.height);
    uiContext.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    uiContext.beginPath();
    uiContext.arc(savedCoords.x, savedCoords.y, radius, 0, 2*Math.PI);
    uiContext.stroke();
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