'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _mocha = require('mocha');

var _mocha2 = _interopRequireDefault(_mocha);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default);

var TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MDA4MTQzODQsImV4cCI6MTUzMjM1MDM4NCwiYXVkIjoiZXE5THZGdU1lazBENGJTY0lzT2JKSjFiNjFCdUtJQjMiLCJpc3MiOiJodHRwczovL2JyYWludHJhaW5lci5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NTk3NDliN2EwOTBmMDQwNWY4MzNiN2FiIn0.iWp27qQCP-y94UrhqfPV-eKX84A0MJlkNypjY-XkbaA';

_mocha2.default.describe('Notecards REST', function () {
  /*
  READ
  */
  _mocha2.default.it('it should GET All notecards', function (done) {
    _chai2.default.request(_index2.default).get('/api/notecard').set('Authorization', TOKEN).end(function (err, res) {
      _chai2.default.expect(res).to.have.status(200);
      _chai2.default.expect(res.body).to.be.an('array');
      done();
    });
  }).timeout(30000);

  /*
  CREATE
  */
  _mocha2.default.it('it should POST a notecard', function (done) {
    var notecard = {
      title: 'Englisch Vokabeln',
      task: 'Was heißt comment?',
      answer: 'Kommentar'
    };
    _chai2.default.request(_index2.default).post('/api/notecard').set('Authorization', TOKEN).send(notecard).end(function (err, res) {
      _chai2.default.expect(res).to.have.status(200);
      _chai2.default.expect(res.body).to.be.a('object');
      _chai2.default.expect(res.body).to.have.property('task');
      _chai2.default.expect(res.body).to.have.property('answer');
      done();
    });
  }).timeout(30000);

  /*
  UPDATE
  */
  _mocha2.default.it('it should UPDATE a notecard', function (done) {
    _async2.default.waterfall([function (next) {
      _chai2.default.request(_index2.default).get('/api/notecard').set('Authorization', TOKEN).end(function (err, res) {
        _chai2.default.expect(res).to.have.status(200);
        /* eslint no-underscore-dangle: 0 */
        var updid = res.body[0]._id;
        var updurl = '/api/notecard/' + updid;
        next(null, updurl);
      });
    }, function (updurl, next) {
      var notecard = {
        title: 'Englisch Vokabeln Update',
        task: 'Was heißt comment?',
        answer: 'Kommentar'
      };
      _chai2.default.request(_index2.default).put(updurl).set('Authorization', TOKEN).send(notecard).end(function (err, res) {
        _chai2.default.expect(res).to.have.status(200);
        _chai2.default.expect(res.body.title).to.equal(notecard.title);
        next(null);
      });
    }], done);
  }).timeout(30000);

  /*
  DELETE
  */
  _mocha2.default.it('it should DELETE a notecard', function (done) {
    _async2.default.waterfall([function (next) {
      _chai2.default.request(_index2.default).get('/api/notecard').set('Authorization', TOKEN).end(function (err, res) {
        _chai2.default.expect(res).to.have.status(200);
        /* eslint no-underscore-dangle: 0 */
        var delid = res.body[0]._id;
        var delurl = '/api/notecard/' + delid;
        next(null, delurl, delid);
      });
    }, function (delurl, delid, next) {
      _chai2.default.request(_index2.default).del(delurl).set('Authorization', TOKEN).end(function (err, res) {
        _chai2.default.expect(res).to.have.status(200);
        /* eslint no-underscore-dangle: 0 */
        _chai2.default.expect(res.body._id).to.equal(delid);
        next(null);
      });
    }], done);
  }).timeout(30000);
});