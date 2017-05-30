import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import http from 'http';
import dbmodels from 'bt-mongodb';
import router from './router';
import websocket from './websocket';

const conf = require('./config.json');

const app = express();
const server = http.Server(app);

app.use(express.static('src/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined', { immediate: true }));

app.set('port', (process.env.PORT || conf.port));

// Über buildWebApp() soll später der Public Ordner mit Inhalt generiert werden
// kann jetzt theoretisch genutzt werden,
// ab hier ist cyclejs repo für den build zuständig
//
// folder 'cwd + ./public_custom_folder'
// const examplePath = path.resolve(process.cwd(), './public_custom_folder');
// frontend.buildWebApp(examplePath);
// import frontend from 'bt-cyclejs';// name vom module wie er im package steht
// import path from 'path';

app.use('/api', router);
websocket(server);

dbmodels.connect(conf.mongodb, (err) => {
  if (err) {
    console.log('Unable to connect to MongoDB');
    process.exit(1);
  } else {
    server.listen(app.get('port'), () => {
      console.log(`Server is listening on port ${app.get('port')}`);
    });
  }
});
