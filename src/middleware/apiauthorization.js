import dbmodels from 'bt-mongodb';
import jsonwebtoken from 'jsonwebtoken';

const conf = require('./../config.json');

function validateJWT(token) {
  try {
    return jsonwebtoken.decode(token, conf.auth0.clientSecret, {
      algorithms: ['HS256'],
      audience: conf.auth0.clientId,
      issuer: `https://${conf.auth0.domain}/` });
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

function getProfile(token, callback) {
  const payloadJson = validateJWT(token);
  if (payloadJson !== undefined) {
  if (payloadJson !== undefined && payloadJson !== null) {
    dbmodels.profile.findByOauthtoken(payloadJson.sub, (err, profile) => {
      callback(err, profile);
    });
  } else {
    callback(new Error('JWT is not valid'), null);
  }
}

function extractTokenFromHeader(header, callback) {
  if (header.authorization && header.authorization.split(' ')[0] === 'Bearer') {
    const authToken = header.authorization.split(' ')[1];
    if (authToken === undefined) {
      callback(new Error('The token is undefined'), null);
    } else {
      callback(null, authToken);
    }
  } else {
    callback(new Error('Authorization header is empty or does not have the format: "Bearer <token>"'), null);
  }
}

function apiAuth(req, res, next) {
  extractTokenFromHeader(req.headers, (err, token) => {
    if (err) {
      next(err);
    } else if (token) {
      getProfile(token, (err1, profile) => {
        if (err1) {
          next(err1);
        } else if (profile === null) {
          next(new Error('No matching profile found'));
        } else {
          req.auth0 = profile;
          next();
        }
      });
    }
  });
}

export default { getProfile, extractTokenFromHeader, apiAuth };
