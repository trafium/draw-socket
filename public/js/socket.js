function initSocket() {
  socket = io.connect();

  socket.on('getCurrentImage', function(url) {
    // drawAsync(context, lines, 100);
    var image = new Image();
    image.src = url;
    context.drawImage(image, 0, 0);
  });

  socket.on('getLine', function(line) {
    console.log(line);
    drawLine(line);
  });

  socket.on('DEBUG', function(data) {
    console.log(data);
  });

  socket.on('clear', function() {
    clear();
  });
}