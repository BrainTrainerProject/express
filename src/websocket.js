import socketio from 'socket.io';

let io = null;

function notify(protocol, message) {
  if (io) {
    io.emit(protocol, message);
  }
}

function createApplication(server) {
  io = socketio(server);

  io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.request.headers);
    setTimeout(() => {
      notify('new card', 'message');
    }, 4000);

    socket.on('message', (msg) => {
      console.log(`message: ${msg}`);
      io.emit('message', msg); // Nachricht an ALLE verteilen
    });

    socket.on('herro', (msg) => {
      console.log(`herro: ${msg}`);
      io.emit('message', msg);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}

export default { createApplication, notify };
// module.exports = notify;
