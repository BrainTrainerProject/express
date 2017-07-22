import dbmodel from 'bt-mongodb';
import websocket from '../websocket';

const NO_OBJECT_ID = 'There was no id in the request';

function createActivityForFollower(profile, message) {
  dbmodel.profile.findByIds(profile.follower, (err1, follower) => {
    // create temporaty Activities
    const activities = [];
    for (let i = 0; i < follower.length; i += 1) {
      const temp = {
        sender: profile.id,
        owner: follower[i].id,
        activityType: message,
      };
      activities.push(temp);
    }

    // create Activities for real
    dbmodel.activity.createActivities(activities, (err2, acts) => {
      for (let i = 0; i < acts.length; i += 1) {
        websocket.notify(profile, acts[i]);
      }
    });
  });
}

// for each activity in the activities list profiles gets linked to its coresponding places
function mapProfileToActivity(activities, callback) {
  const idsProfile = [];

  // Alle ids ermitteln
  for (let i = 0; i < activities.length; i += 1) {
    idsProfile.push(activities[i].owner.toString());
    idsProfile.push(activities[i].sender.toString());
  }

  dbmodel.profile.findByIds(idsProfile, (err, profiles) => {
    const acti = [];
    for (let i = 0; i < activities.length; i += 1) {
      const temp = activities[i].toObject();
      for (let j = 0; j < profiles.length; j += 1) {
        if (activities[i].sender.toString() === profiles[j].id) {
          temp.sender = profiles[j];
        }
        if (activities[i].owner.toString() === profiles[j].id) {
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
  dbmodel.activity.findByOwner(req.auth0.id, req.params.page, 10, (err, activities) => {
    if (err) {
      res.send(err);
    } else {
      mapProfileToActivity(activities, (act) => {
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
    dbmodel.activity.findByOwner(req.params.id, req.params.page, 10, (err, activities) => {
      if (err) {
        res.send(err);
      } else {
        mapProfileToActivity(activities, (act) => {
          res.send(act);
        });
      }
    });
  }
}

export default {
  pageActivityAction,
  pageActivityByIdAction,
  createActivityForFollower,
};
