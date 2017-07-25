import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import http from 'http';
import dbmodels from 'bt-mongodb';
import cors from 'cors';
import router from './router';
import websocket from './websocket';
import mobileN from './mobile-notifier';

const conf = require('./config.json');

const app = express();
const server = http.Server(app);

app.use(cors());
app.use(express.static('lib/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined', { immediate: true }));

app.set('port', (process.env.PORT || conf.port));

app.post('/echo', (req, res) => {
  res.send(req.body);
});

app.use('/api', router);
websocket.createApplication(server);
mobileN.startProcess();

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
