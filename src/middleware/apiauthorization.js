import dbmodels from 'bt-mongodb';

module.exports = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const authToken = req.headers.authorization.split(' ')[1];

    if (authToken === undefined) {
      next(new Error('The token is undefined'));
    }

    dbmodels.profile.findByOauthtoken(authToken, (err, profile) => {
      if (err) {
        next(new Error('Error in findIdByOauthtoken'));
      }

      if (!profile) {
        next(new Error('No matching profile found'));
      }

      next();
    });
  } else {
    next(new Error('Authorization header is empty or does not have the format: "Bearer <token>"'));
  }
};
