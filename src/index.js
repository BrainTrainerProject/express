import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import frontend from 'bt-cyclejs';// name vom module wie er im package steht
import router from './router';

const app = express();

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

app.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
