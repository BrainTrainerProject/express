import dbmodel from 'bt-mongodb';
import websocket from '../websocket';

const NO_OBJECT_ID = 'There was no id in the request';

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
 *     "owner": "5942637d16560b00013afd9d",
 *     "sender": "59425e658878750001a42a78",
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
      res.send(activities);
    }
  });
}

/**
 * @api             {get} notecard GET activities
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
 *     "owner": "5942637d16560b00013afd9d",
 *     "sender": "59425e658878750001a42a78",
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
        res.send(activities);
      }
    });
  }
}

function createActivityForFollower(creator, type) {
  for (let i = 0; i < creator.follower.length; i += 1) {
    const jso = {
      owner: creator.follower[i],
      sender: creator.id,
      activityType: type,
    };
    dbmodel.activity.createActivity(jso, (err, newActivity) => {
      if (err) {
        console.log(err);
      } else {
        websocket.notify(creator, newActivity);
      }
    });
  }
}

export default {
  pageActivityAction,
  pageActivityByIdAction,
  createActivityForFollower,
};
