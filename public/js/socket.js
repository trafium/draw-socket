function initSocket() {
  socket = io.connect();

  socket.on('getCurrentImage', function(url) {
    // drawAsync(context, lines, 100);
    var image = new Image();
    image.src = url;
    context.drawImage(image, 0, 0);
  });

  socket.on('getLine', function(line) {
    drawLine(line);
  });

  socket.on('clear', function() {
    clear();
  });

  socket.on('requestCurrentImage', function(req) {
    console.log('On request for ' + req.forSocket + ' made response.');
    socket.emit('responseCurrentImage', { 
      image: $canvas.get(0).toDataURL(), 
      forSocket: req.forSocket 
    });

  });
}