const express = require('express');
const frontend = require('bt-cyclejs');// name vom module wie er im package steht
const path = require('path');

const app = express();

app.use(express.static('public'));

// Über buildWebApp() soll später der Public Ordner mit Inhalt generiert werden
// kann jetzt theoretisch genutzt werden,
// ab hier ist cyclejs repo für den build zuständig
//
// folder 'cwd + ./public_custom_folder'
const examplePath = path.resolve(process.cwd(), './public_custom_folder');
frontend.buildWebApp(examplePath);

app.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
