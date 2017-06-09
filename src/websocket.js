import socketio from 'socket.io';
import auth from './middleware/apiauthorization';

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
    auth.extractTokenFromHeader(socket.request.headers, (err, token) => {
      if (err) {
        // TODO connection ablehnen
      } else {
        auth.getProfile(token, (err1, profile) => {
          if (err1 || profile === null) {
            console.log(err1);
          } else {
            console.log(profile);
          }
        });
      }
    });

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
