'use strict';

var express = require('express');
var frontend = require('bt-cyclejs'); // name vom module wie er im package steht
var path = require('path');

var app = express();

app.use(express.static('public'));

// Über buildWebApp() soll später der Public Ordner mit Inhalt generiert werden
// kann jetzt theoretisch genutzt werden,
// ab hier ist cyclejs repo für den build zuständig
//
// folder 'cwd + ./public_custom_folder'
var examplePath = path.resolve(process.cwd(), './public_custom_folder');
frontend.buildWebApp(examplePath);

app.listen(8080, function () {
  console.log('Server is listening on port 8080');
});