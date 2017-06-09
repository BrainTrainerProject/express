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
      callback(new Error('blub'), null);
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
  }
}

module.exports = (req, res, next) => {
  extractTokenFromHeader(req.headers, (err, token) => {
    if (err) {
      next(err);
    } else if (token) {
      getProfile(token, (err1, profile) => {
        if (err1) {
          next(new Error('Error in getProfile'));
        }

        if (!profile) {
          next(new Error('No matching profile found'));
        }

        req.auth0 = profile;
        next();
      });
    } else {
      next(new Error('Authorization header is empty or does not have the format: "Bearer <token>"'));
    }
  });
};

module.exports.getProfile = getProfile;
module.exports.extractTokenFromHeader = extractTokenFromHeader;
