'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _apiauthorization = require('./middleware/apiauthorization');

var _apiauthorization2 = _interopRequireDefault(_apiauthorization);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var io = null;
var users = [];

function notify(sender, activity) {
  if (io) {
    for (var i = 0; i < sender.follower.length; i += 1) {
      for (var j = 0; j < users.length; j += 1) {
        if (sender.follower[i].toString() === users[j].profile.id.toString()) {
          users[j].socket.emit(activity.activityType, activity.toString());
          break;
        }
      }
    }
  }
}

function createApplication(server) {
  io = (0, _socket2.default)(server);

  io.on('connection', function (socket) {
    console.log('try to connect');
    var ss = socket;
    ss.authorized = false;
    socket.emit('connected', { connected: true, authorized: false });

    setTimeout(function () {
      if (!ss.authorized) {
        socket.disconnect(true);
      }
    }, 2000); // 2 second to authorize or kill the socket

    socket.on('authorize', function (data) {
      ss.authorized = true;
      if (!data.token) {
        socket.disconnect(true);
      } else {
        _apiauthorization2.default.getProfile(data.token, function (err1, profile) {
          if (err1 || profile === null) {
            socket.disconnect(true);
          } else {
            var iid = setInterval(function () {
              socket.emit('practice_begin', 'justDoIt!');
              console.log('submit practice');
            }, profile.interval * 60 * 1000);
            users.push({ socket: socket, profile: profile, iid: iid });
            console.log('connect successful');
          }
        });
      }
    });

    socket.on('message', function (msg) {
      console.log('message: ' + msg);
      io.emit('message', msg); // Nachricht an ALLE verteilen
    });

    socket.on('disconnect', function () {
      for (var i = 0; i < users.length; i += 1) {
        if (users[i].socket === socket) {
          clearInterval(users[i].iid);
          users.splice(i, 1);
          break;
        }
      }
      console.log('user disconnected');
    });
  });
}

exports.default = { createApplication: createApplication, notify: notify };