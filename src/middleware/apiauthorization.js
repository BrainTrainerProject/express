import dbmodels from 'bt-mongodb';
import request from 'request';

function getProfile(token, callback) {
  request({ url: 'https://braintrainer.eu.auth0.com/userinfo', headers: { Authorization: `Bearer ${token}` } }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      dbmodels.profile.findByOauthtoken(body.sub, (err, profile) => {
        callback(err, profile);
      });
    } else {
      callback(new Error('blub'), null);
    }
  });
}

module.exports = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const authToken = req.headers.authorization.split(' ')[1];

    if (authToken === undefined) {
      next(new Error('The token is undefined'));
    }

    module.exports.getProfile(authToken, (err, profile) => {
      if (err) {
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
};

module.exports.getProfile = getProfile;
