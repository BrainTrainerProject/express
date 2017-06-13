import dbmodel from 'bt-mongodb';
import websocket from '../websocket';

const CONTACT_ADMIN = 'there was an error, please contact an admin';
const BODY_EMPTY = 'The body was empty';
const NO_OBJECT_ID = 'There was no id in the request';
// const NOT_EXISTED_BEFORE = 'Couldn\'t match id to an actual object';
// const NOT_OWNER = 'you are not the owner of that object';

function getAllAction(req, res) {
  dbmodel.profile.findAll((err, map) => {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else {
      res.send(map);
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
 *   "email": "trololo.guy@meme.com",
 *   "oauthtoken": "auth0|bigfatuglynumber",
 *   "photourl": "https://s.gravatar.com/avatar/bigfatuglynumber.png",
 *   "follower": [],
 *   "visibility": false,
 *   "sets": []
 * }
 */
function getByIdAction(req, res) {
  dbmodel.profile.findById(req.auth0.id, (err, profile) => {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else {
      res.send(profile);
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

function updateAction(req, res) {
  dbmodel.profile.updateProfile(req.auth0.id, req.body, (err, changedProfile) => {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else {
      res.send(changedProfile);
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
 *   "wuppi": "fluppi"
 * }
 */
function followAction(req, res) {
  if (req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    dbmodel.profile.addfollower(req.params.id, req.auth0.id, (err, profile) => {
      if (err) {
        res.send(err);
      } else {
        res.send(profile);
        websocket.notify('profile_follower_add', JSON.stringify(profile));
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
 *   "wuppi": "fluppi"
 * }
 */
function unfollowAction(req, res) {
  res.send('Not yet implemented');
  // websocket.notify('profile_follower_remove', JSON.stringify(profile));
}

export default {
  getAllAction,
  getByIdAction,
  createAction,
  updateAction,
  deleteAction,
  followAction,
  unfollowAction,
};
