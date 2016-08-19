var socketio = require('socket.io');

var lines = [];

module.exports = (server) => {
  var io = socketio.listen(server);

  io.on('connection', (socket) => {
    
    console.log('Socket connected: ' + socket.id);
    socket.join('main');

    socket.on('postLine', (line) => {
      lines.push(line);
      socket.broadcast.to('main').emit('getLine', line);
    });

    io.to(socket.id).emit('getCurrentDrawing', lines);
    
  });


}