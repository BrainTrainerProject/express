import dbmodels from 'bt-mongodb';
import jsonwebtoken from 'jsonwebtoken';
import errorcodes from './errorJsons';

const conf = require('./../config.json');

function validateJWT(token) {
  try {
    return jsonwebtoken.verify(token, conf.auth0.clientSecret, {
      algorithms: ['HS256'],
      audience: conf.auth0.clientId,
      issuer: `https://${conf.auth0.domain}/` });
  } catch (err) {
    // console.log(err); // TODO: Überlegen, ob das loggen nötig ist
    return undefined;
  }
}

function getProfile(token, callback) {
  const payloadJson = validateJWT(token);
  if (payloadJson !== undefined && payloadJson !== null) {
    dbmodels.profile.findByOauthtoken(payloadJson.sub, (err, profile) => {
      callback(err, profile);
    });
  } else {
    callback(errorcodes.jwtNotValid(), null);
  }
}

function extractTokenFromHeader(header, callback) {
  if (header.authorization && header.authorization.split(' ')[0] === 'Bearer') {
    const authToken = header.authorization.split(' ')[1];
    if (authToken === undefined) {
      callback(errorcodes.undefinedToken(), null);
    } else {
      callback(null, authToken);
    }
  } else {
    callback(errorcodes.wrongAuthHeader(), null);
  }
}

function apiAuth(req, res, next) {
  extractTokenFromHeader(req.headers, (err, token) => {
    if (err) {
      res.send(err);
    } else if (token) {
      getProfile(token, (err1, profile) => {
        if (err1) {
          res.send(err1);
        } else if (profile === null) {
          res.send(errorcodes.noMatchingProfile());
        } else {
          req.auth0 = profile;
          next();
        }
      });
    }
  });
}

export default { getProfile, extractTokenFromHeader, apiAuth };
