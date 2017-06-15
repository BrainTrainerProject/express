import socketio from 'socket.io';
import auth from './middleware/apiauthorization';

let io = null;
const users = [];

function notify(sender, activity) {
  if (io) {
    for (let i = 0; i < sender.follower.length; i += 1) {
      for (let j = 0; j < users.length; j += 1) {
        if (sender.follower[i].toString() === users[j].profile.id.toString()) {
          users[j].socket.emit(activity.activityType, activity.toString());
          break;
        }
      }
    }
  }
}

function createApplication(server) {
  io = socketio(server);

  io.on('connection', (socket) => {
    console.log('try to connect');
    auth.extractTokenFromHeader(socket.request.headers, (err, token) => {
      if (err) {
        socket.disconnect(true);
      } else {
        auth.getProfile(token, (err1, profile) => {
          if (err1 || profile === null) {
            socket.disconnect(true);
          } else {
            users.push({ socket, profile });
            console.log('connect successful');
          }
        });
      }
    });

    socket.on('message', (msg) => {
      console.log(`message: ${msg}`);
      io.emit('message', msg); // Nachricht an ALLE verteilen
    });

    socket.on('disconnect', () => {
      for (let i = 0; i < users.length; i += 1) {
        if (users[i].socket === socket) {
          users.splice(i, 1);
          break;
        }
      }
      console.log('user disconnected');
    });
  });
}

export default { createApplication, notify };
