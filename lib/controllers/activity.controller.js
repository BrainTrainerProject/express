'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _btMongodb = require('bt-mongodb');

var _btMongodb2 = _interopRequireDefault(_btMongodb);

var _websocket = require('../websocket');

var _websocket2 = _interopRequireDefault(_websocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NO_OBJECT_ID = 'There was no id in the request';

function createActivityForFollower(profile, message) {
  _btMongodb2.default.profile.findByIds(profile.follower, function (err1, follower) {
    // create temporaty Activities
    var activities = [];
    for (var i = 0; i < follower.length; i += 1) {
      var temp = {
        sender: profile.id,
        owner: follower[i].id,
        activityType: message
      };
      activities.push(temp);
    }

    if (activities.length > 0) {
      // create Activities for real
      _btMongodb2.default.activity.createActivities(activities, function (err2, acts) {
        for (var _i = 0; _i < acts.length; _i += 1) {
          _websocket2.default.notify(profile, acts[_i]);
        }
      });
    }
  });
}

// for each activity in the activities list profiles gets linked to its coresponding places
function mapProfileToActivity(activities, callback) {
  var idsProfile = [];

  // Alle ids ermitteln
  for (var i = 0; i < activities.length; i += 1) {
    idsProfile.push(activities[i].owner.toString());
    idsProfile.push(activities[i].sender.toString());
  }

  _btMongodb2.default.profile.findByIds(idsProfile, function (err, profiles) {
    var acti = [];
    for (var _i2 = 0; _i2 < activities.length; _i2 += 1) {
      var temp = activities[_i2].toObject();
      for (var j = 0; j < profiles.length; j += 1) {
        if (activities[_i2].sender.toString() === profiles[j].id) {
          temp.sender = profiles[j];
        }
        if (activities[_i2].owner.toString() === profiles[j].id) {
          temp.owner = profiles[j];
        }
        acti.push(temp);
      }
    }
    callback(acti);
  });
}

/**
 * @api             {get} notecard GET activities
 * @apiName         GetPagewiseActivities
 * @apiGroup        activity
 * @apiDescription  Collects all the activities of the page with an offset of 10
 * entries.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * [
 *   {
 *     "_id": "594282b35b08b83670439abd",
 *     "owner": <profile object>,
 *     "sender": <profile object>,
 *     "activityType": "set_new",
 *     "__v": 0
 *   },...
 * ]
 */
function pageActivityAction(req, res) {
  _btMongodb2.default.activity.findByOwner(req.auth0.id, req.params.page, 10, function (err, activities) {
    if (err) {
      res.send(err);
    } else {
      mapProfileToActivity(activities, function (act) {
        res.send(act);
      });
    }
  });
}

/**
 * @api             {get} notecard GET activities by id
 * @apiName         GetPagewiseActivitiesById
 * @apiGroup        activity
 * @apiDescription  Collects all the activities of the page with an offset of 10
 * entries.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiParam        {Number} id id of the owner
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * [
 *   {
 *     "_id": "594282b35b08b83670439abd",
 *     "owner": <profile object>,
 *     "sender": <profile object>,
 *     "activityType": "set_new",
 *     "__v": 0
 *   },...
 * ]
 */
function pageActivityByIdAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    _btMongodb2.default.activity.findByOwner(req.params.id, req.params.page, 10, function (err, activities) {
      if (err) {
        res.send(err);
      } else {
        mapProfileToActivity(activities, function (act) {
          res.send(act);
        });
      }
    });
  }
}

exports.default = {
  pageActivityAction: pageActivityAction,
  pageActivityByIdAction: pageActivityByIdAction,
  createActivityForFollower: createActivityForFollower
};