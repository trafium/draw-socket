var socketio = require('socket.io');

// var lines = [];

var currentImage = '';

module.exports = (server) => {
  var io = socketio.listen(server);

  io.on('connection', (socket) => {
    
    console.log('Socket connected: ' + socket.id);
    socket.join('main');

    socket.on('postLine', (line) => {
      // lines.push(line);
      socket.broadcast.to('main').emit('getLine', line);
    });

    socket.on('postCurrentImage', (image) => {
      currentImage = image;
    });

    io.to(socket.id).emit('getCurrentImage', currentImage);
    
  });


}