var socketio = require('socket.io');

// var lines = [];

var currentImage = '';

module.exports = (server) => {
  var io = socketio.listen(server);

  io.on('connection', (socket) => {
    
    io.to(socket.id).emit('clear');
    
    console.log('Socket connected: ' + socket.id);
    socket.join('main');

    socket.on('postLine', (line) => {
      // lines.push(line);
      socket.broadcast.to('main').emit('getLine', line);
    });

    socket.on('postCurrentImage', (image) => {
      currentImage = image;
    });

    // var socketsInRoom = Object.keys(io.sockets.sockets);
    // console.log(socketsInRoom);
    // if (socketsInRoom.length > 1) {
    //   for (var i = 0; i < socketsInRoom.length; i++) {
    //     if (socketsInRoom[i] != socket.id) {
    //       io.to(socketsInRoom[i]).emit('requestCurrentImage', { forSocket: socket.id });
    //       break;
    //     }
    //   }
    // } else {
      io.to(socket.id).emit('getCurrentImage', currentImage);
    // }

    // socket.on('responseCurrentImage', (response) => {
    //   currentImage = response.image;
    //   io.to(response.forSocket).emit('getCurrentImage', currentImage);
    // });
    
  });


}