'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _btMongodb = require('bt-mongodb');

var _btMongodb2 = _interopRequireDefault(_btMongodb);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _errorJsons = require('./errorJsons');

var _errorJsons2 = _interopRequireDefault(_errorJsons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conf = require('./../config.json');

function validateJWT(token) {
  try {
    return _jsonwebtoken2.default.verify(token, conf.auth0.clientSecret, {
      algorithms: ['HS256'],
      audience: conf.auth0.clientId,
      issuer: 'https://' + conf.auth0.domain + '/' });
  } catch (err) {
    // console.log(err); // TODO: Überlegen, ob das loggen nötig ist
    return undefined;
  }
}

function getProfile(token, callback) {
  var payloadJson = validateJWT(token);
  if (payloadJson !== undefined && payloadJson !== null) {
    _btMongodb2.default.profile.findByOauthtoken(payloadJson.sub, function (err, profile) {
      callback(err, profile);
    });
  } else {
    callback(_errorJsons2.default.jwtNotValid(), null);
  }
}

function extractTokenFromHeader(header, callback) {
  if (header.authorization && header.authorization.split(' ')[0] === 'Bearer') {
    var authToken = header.authorization.split(' ')[1];
    if (authToken === undefined) {
      callback(_errorJsons2.default.undefinedToken(), null);
    } else {
      callback(null, authToken);
    }
  } else {
    callback(_errorJsons2.default.wrongAuthHeader(), null);
  }
}

function apiAuth(req, res, next) {
  extractTokenFromHeader(req.headers, function (err, token) {
    if (err) {
      res.send(err);
    } else if (token) {
      getProfile(token, function (err1, profile) {
        if (err1) {
          res.send(err1);
        } else if (profile === null) {
          res.send(_errorJsons2.default.noMatchingProfile());
        } else {
          req.auth0 = profile;
          next();
        }
      });
    }
  });
}

exports.default = { getProfile: getProfile, extractTokenFromHeader: extractTokenFromHeader, apiAuth: apiAuth };