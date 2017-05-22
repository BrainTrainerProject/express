import socketio from 'socket.io';

function createApplication(httpServer) {
  const io = socketio(httpServer);

  io.on('connection', (socket) => {
    console.log('a user connected');

    setTimeout(() => {
      socket.send('Sent a message 4 seconds after connection!');
    }, 4000);

    socket.on('message', (msg) => {
      console.log(`message: ${msg}`);
      io.emit('message', msg); // Nachricht an ALLE verteilen
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}

module.exports = createApplication;
