import dbmodels from 'bt-mongodb';
import request from 'request';

function getProfile(token, callback) {
  request({ url: 'https://braintrainer.eu.auth0.com/userinfo', headers: { Authorization: `Bearer ${token}` } }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const bodyJson = JSON.parse(body);
      dbmodels.profile.findByOauthtoken(bodyJson.sub, (err, profile) => {
        callback(err, profile);
      });
    } else {
      callback(error, null);
    }
  });
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
