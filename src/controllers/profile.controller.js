import dbmodel from 'bt-mongodb';
// import mobileN from '../mobile-notifier';

const CONTACT_ADMIN = 'there was an error, please contact an admin';
const BODY_EMPTY = 'The body was empty';
const NO_OBJECT_ID = 'There was no id in the request';
const NOT_VISIBLE = 'Profile is private';
// const NOT_EXISTED_BEFORE = 'Couldn\'t match id to an actual object';
// const NOT_OWNER = 'you are not the owner of that object';

function appendStatistic(prof, res) {
  const profile1 = prof.toObject();
  profile1.setsCount = 0;
  profile1.notecardCount = 0;
  profile1.followerCount = 0;

  profile1.followerCount = profile1.follower.length;

  dbmodel.set.findByOwner(profile1.id, (err, sets) => {
    if (sets) {
      profile1.setsCount = sets.length;
    }
    dbmodel.notecard.findByOwner(profile1.id, (err1, cards) => {
      if (cards) {
        profile1.notecardCount = cards.length;
      }
      res.send(profile1);
    });
  });
}

function getProfiles(callback) {
  dbmodel.profile.findAll(callback);
}

function getProfile(id, callback) {
  dbmodel.profile.findById(id, callback);
}

/**
 * @api             {get} profile GET specified profile
 * @apiName         GetSpecifiedProfile
 * @apiGroup        profile
 * @apiDescription  Returns the specified profile.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   "_id": "5942637d16560b00013afd9d",
 *   "email": "trololo.guy@meme.com",
 *   "oauthtoken": "auth0|bigfatuglynumber",
 *   "photourl": "https://s.gravatar.com/avatar/bigfatuglynumber.png",
 *   "visibility": true,
 *   "cardsPerSession": 5,
 *   "interval": 30
 *   "follower": [],
 *   "sets": [],
 *   "__v": 0,
 * }
 */
function getByIdAction(req, res) {
  getProfile(req.params.id, (err, profile) => {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else if (profile.visibility) {
      appendStatistic(profile, res);
    } else {
      res.send(NOT_VISIBLE);
    }
  });
}

/**
 * @api             {get} profile GET authorized profile
 * @apiName         GetAuthorizedProfile
 * @apiGroup        profile
 * @apiDescription  Returns the authorized profile.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   "_id": "5942637d16560b00013afd9d",
 *   "email": "trololo.guy@meme.com",
 *   "oauthtoken": "auth0|bigfatuglynumber",
 *   "photourl": "https://s.gravatar.com/avatar/bigfatuglynumber.png",
 *   "visibility": false,
 *   "cardsPerSession": 5,
 *   "interval": 30
 *   "follower": [],
 *   "sets": [],
 *   "__v": 0,
 * }
 */
function getByOwnerAction(req, res) {
  dbmodel.profile.findById(req.auth0.id, (err, profile) => {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else {
      appendStatistic(profile, res);
    }
  });
}

function createAction(req, res) {
  if (req.body === null) {
    res.send(BODY_EMPTY);
  } else {
    dbmodel.profile.createProfile(req.body, (err, newProfile) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(newProfile);
      }
    });
  }
}

/**
 * @api             {put} profile PUT authorized profile
 * @apiName         PutAuthorizedProfile
 * @apiGroup        profile
 * @apiDescription  Updates the authorized profile.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * Content-Type: application/json
 * Content-Type: application/json
 * {
 *   "_id": "5942637d16560b00013afd9d"
 *   "email": "trololo.guy@meme.com",
 *   "oauthtoken": "auth0|bigfatuglynumber",
 *   "photourl": "https://s.gravatar.com/avatar/bigfatuglynumber.png",
 *   "visibility": false,
 *   "cardsPerSession": 5,
 *   "interval": 30
 *   "follower": [],
 *   "sets": []
 * }
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   "_id": "5942637d16560b00013afd9d"
 *   "email": "trololo.guy@meme.com",
 *   "oauthtoken": "auth0|bigfatuglynumber",
 *   "photourl": "https://s.gravatar.com/avatar/bigfatuglynumber.png",
 *   "visibility": false,
 *   "cardsPerSession": 5,
 *   "interval": 30
 *   "follower": [],
 *   "sets": [],
 *   "__v": 0,
 * }
 */
function updateAction(req, res) {
  dbmodel.profile.updateProfile(req.auth0.id, req.body, (err, changedProfile) => {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else {
      res.send(changedProfile);
      /* // anschalten, wenn Zeit zum testen da war :(
      mobileN.removeProfile(changedProfile.id);
      mobileN.addProfile(changedProfile);
      */
    }
  });
}

function deleteAction(req, res) {
  dbmodel.profile.deleteProfile(req.auth0.id, (err, result) => {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else {
      res.send(result);
    }
  });
}

/**
 * @api             {post} profile/:id/follow POST ProfileFollow
 * @apiName         PostProfileFollow
 * @apiGroup        profile
 * @apiDescription  Adds the authorized Profile as a follower to target Profile.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiParam        {Number} id id of target profile
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   status: 'ok'
 * }
 */
function followAction(req, res) {
  if (req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    dbmodel.profile.addFollower(req.params.id, [req.auth0.id], (err, profile) => {
      if (err) {
        // error logging
        res.send({ status: 'error' });
      } else {
        res.send({ status: 'ok' });
        console.log(profile);
      }
    });
  }
}

/**
 * @api             {post} profile/:id/follow POST ProfileUnfollow
 * @apiName         PostProfileUnfollow
 * @apiGroup        profile
 * @apiDescription  Removes the authorized Profile as a follower of target Profile.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiParam        {Number} id id of target profile
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   status: 'ok'
 * }
 */
function unfollowAction(req, res) {
  if (req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    dbmodel.profile.removeFollower(req.params.id, [req.auth0.id], (err, profile) => {
      if (err) {
        // error logging
        res.send({ status: 'error' });
      } else {
        res.send({ status: 'ok' });
        console.log(profile);
      }
    });
  }
}

export default {
  getByIdAction,
  getByOwnerAction,
  createAction,
  updateAction,
  deleteAction,
  followAction,
  unfollowAction,
  getProfile,
  getProfiles,
};
