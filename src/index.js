import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import socketio from 'socket.io';
import http from 'http';
import frontend from 'bt-cyclejs';// name vom module wie er im package steht
import router from './router';

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static('src/public'));
app.use(bodyParser.json());
app.use(morgan('combined', { immediate: true }));

// Über buildWebApp() soll später der Public Ordner mit Inhalt generiert werden
// kann jetzt theoretisch genutzt werden,
// ab hier ist cyclejs repo für den build zuständig
//
// folder 'cwd + ./public_custom_folder'
const examplePath = path.resolve(process.cwd(), './public_custom_folder');
frontend.buildWebApp(examplePath);

app.use('/api', router);

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

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
