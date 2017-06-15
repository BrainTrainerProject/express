import dbmodel from 'bt-mongodb';
import activityController from './activity.controller';

// Man kommt nur soweit, wenn man sich authorisiert *hat*. daher wird hier nie
// auf req.auth0.id geprueft.

const CONTACT_ADMIN = 'there was an error, please contact an admin';
const BODY_EMPTY = 'The body was empty or not fitting';
const NO_OBJECT_ID = 'There was no id in the request';
const NOT_EXISTED_BEFORE = 'Couldn\'t match id to an actual object';
const NOT_OWNER = 'you are not the owner of that object';

/**
 * @api             {get} set GET owned Sets
 * @apiName         GetAllSets
 * @apiGroup        set
 * @apiDescription  Collects all the sets of which the authorizated profile
 * has access to and returns them in a json response.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   "59402f281704792b4c4a151f": {
 *     "__v": 0,
 *     "owner": "593eaa0bcf7f5000011c24c4",
 *     "lastchange": "2017-06-13T18:30:00.076Z",
 *     "visibility": true,
 *     "photourl": "",
 *     "title": "Never gonna give you up",
 *     "description": "Never gonna let you down",
 *     "valuations": [],
 *     "tags": [ "wuppi", "fluppi" ],
 *     "notecard": [ "593eaebcf8ac692c4c13b2c1" ]
 *   },...
 * }
 */
function getAllAction(req, res) {
  dbmodel.set.findByOwner(req.auth0.id, (err, sets) => {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else {
      res.send(sets);
    }
  });
}

/**
 * @api             {get} set/:id GET specific Set
 * @apiName         GetSpecificSet
 * @apiGroup        set
 * @apiDescription  Returns the Set with the given id.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiParam        {Number} id id of the set
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   "__v": 0,
 *   "owner": "593eaa0bcf7f5000011c24c4",
 *   "lastchange": "2017-06-13T18:30:00.076Z",
 *   "visibility": true,
 *   "photourl": "",
 *   "title": "Never gonna give you up",
 *   "description": "Never gonna let you down",
 *   "_id": "59402f281704792b4c4a151f",
 *   "valuations": [],
 *   "tags": [ "wuppi", "fluppi" ],
 *   "notecard": [ "593eaebcf8ac692c4c13b2c1" ]
 * }
 */
function getByIdAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    dbmodel.set.findById(req.params.id, (err, set) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(set);
      }
    });
  }
}

/**
 * @api             {post} set POST Set
 * @apiName         PostSet
 * @apiGroup        set
 * @apiDescription  Creates a Set of the given json body.
 * Owner and the date of creation will be set automatically.
 * Emits the set_new event on the websocket for follower
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * Content-Type: application/json
 * {
 *   "notecard": [ "593eaebcf8ac692c4c13b2c1" ],
 *   "tags": [ "wuppi", "fluppi" ],
 *   "valuations": [],
 *   "visibility": "true",
 *   "photourl": "",
 *   "title": "Never gonna give you up",
 *   "description": "Never gonna let you down"
 * }
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   "__v": 0,
 *   "owner": "593eaa0bcf7f5000011c24c4",
 *   "lastchange": "2017-06-13T18:30:00.076Z",
 *   "visibility": true,
 *   "photourl": "",
 *   "title": "Never gonna give you up",
 *   "description": "Never gonna let you down",
 *   "_id": "59402f281704792b4c4a151f",
 *   "valuations": [],
 *   "tags": [ "wuppi", "fluppi" ],
 *   "notecard": [ "593eaebcf8ac692c4c13b2c1" ]
 * }
 */
function createAction(req, res) {
  if (req.body === null) {
    res.send(BODY_EMPTY);
  } else {
    req.body.owner = req.auth0.id;
    req.body.lastchange = new Date();
    dbmodel.set.createSet(req.body, (err, newSet) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(newSet);
        activityController.createActivityForFollower(req.auth0, 'set_new');
      }
    });
  }
}

/**
 * @api             {put} set/:id PUT Set
 * @apiName         PutSet
 * @apiGroup        set
 * @apiDescription  Updates a Set with the given json body.
 * Owner and the date of lastchange will be set automatically.
 * Emits the set_update event on the websocket for follower.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiParam        {Number} id id of the Set which will be updated
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * Content-Type: application/json
 * {
 *   "notecard": [ "593eaebcf8ac692c4c13b2c1", "593eba2d2de774329cfc492d" ],
 *   "tags": [ "wuppi", "fluppi", "duppi" ],
 *   "valuations": [],
 *   "visibility": "false",
 *   "photourl": "",
 *   "title": "Never gonna run around",
 *   "description": "and desert you",
 * }
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 * "_id": "59402f281704792b4c4a151f",
 * "owner": "593eaa0bcf7f5000011c24c4",
 * "lastchange": "2017-06-13T18:53:38.560Z",
 * "visibility": false,
 * "photourl": "",
 * "title": "Never gonna run around",
 * "description": "and desert you",
 * "__v": 0,
 * "valuations": [],
 * "tags": [ "wuppi", "fluppi", "duppi" ],
 * "notecard": [ "593eaebcf8ac692c4c13b2c1", "593eba2d2de774329cfc492d" ]
}
 */
function updateAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else if (req.body === null) {
    res.send(BODY_EMPTY);
  } else {
    dbmodel.set.findById(req.params.id, (err, set) => {
      if (err) {
        res.send(NOT_EXISTED_BEFORE);
      } else if (set.owner.toString() === req.auth0.id) {
        req.body.lastchange = new Date();
        dbmodel.set.updateSet(req.params.id, req.body, (err1, changedSet) => {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(changedSet);
            activityController.createActivityForFollower(req.auth0, 'set_update');
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

/**
 * @api             {delete} set/:id DELETE Set
 * @apiName         DeleteSet
 * @apiGroup        set
 * @apiDescription  Deletes a Set.
 * Emits the set_delete event on the websocket for follower.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiParam        {Number} id id of the Set which will be deleted
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * {
 *   "_id": "59403626858fab21f0028f6c",
 *   "owner": "593eaa0bcf7f5000011c24c4",
 *   "lastchange": "2017-06-13T18:59:50.780Z",
 *   "visibility": true,
 *   "photourl": "",
 *   "title": "Never gonna give you up",
 *   "description": "Never gonna let you down",
 *   "__v": 0,
 *   "valuations": [],
 *   "tags": [ "wuppi", "fluppi" ],
 *   "notecard": [ "593eaebcf8ac692c4c13b2c1" ]
 * }
 */
function deleteAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    dbmodel.set.findById(req.params.id, (err, set) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else if (set.owner.toString() === req.auth0.id) {
        dbmodel.set.deleteSet(req.params.id, (err1, result) => {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(result);
            activityController.createActivityForFollower(req.auth0, 'set_delete');
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

/**
 * @api             {post} set/:id/addCards POST addCards
 * @apiName         PostSetAddCard
 * @apiGroup        set
 * @apiDescription  Adds given cards to the set.
 * Emits the set_update event on the websocket for follower.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiParam        {Number} id id of the Set on which the cards will be added
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * {
 *   "notecards": [ "59425ee05ee41e268c9dec3c",... ]
 * }
 *
 * @apiSuccessExample {json} Response 200
 * {
 *   "_id": "59425f345ee41e268c9dec3d",
 *   "owner": "59425e658878750001a42a78",
 *   "lastchange": "2017-06-15T10:19:32.904Z",
 *   "visibility": true,
 *   "photourl": "",
 *   "title": "Never gonna give you up",
 *   "description": "Never gonna let you down",
 *   "__v": 0,
 *   "valuations": [],
 *   "tags": [
 *     "wuppi",
 *     "fluppi"
 *   ],
 *   "notecard": [
 *     "59425eda5ee41e268c9dec3a",
 *     "59425ee05ee41e268c9dec3c"
 *   ]
 * }
 */
function addCardsAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else if (req.body === null || req.body.notecards === undefined) {
    res.send(BODY_EMPTY);
  } else {
    dbmodel.set.findById(req.params.id, (err, set) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else if (set.owner.toString() === req.auth0.id) {
        dbmodel.set.addNotecards(req.params.id, req.body.notecards, (err1, result) => {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(result);
            activityController.createActivityForFollower(req.auth0, 'set_update');
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

/**
 * @api             {post} set/:id/removeCards POST removeCards
 * @apiName         PostSetRemoveCard
 * @apiGroup        set
 * @apiDescription  Removes given cards to the set.
 * Emits the set_update event on the websocket for follower.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiParam        {Number} id id of the Set on which the cards will be removed
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * {
 *   "notecards": [ "593eaebcf8ac692c4c13b2c1",... ]
 * }
 *
 * @apiSuccessExample {json} Response 200
 * {
 *   "_id": "59425f345ee41e268c9dec3d",
 *   "owner": "59425e658878750001a42a78",
 *   "lastchange": "2017-06-15T10:19:32.904Z",
 *   "visibility": true,
 *   "photourl": "",
 *   "title": "Never gonna give you up",
 *   "description": "Never gonna let you down",
 *   "__v": 0,
 *   "valuations": [],
 *   "tags": [
 *     "wuppi",
 *     "fluppi"
 *   ],
 *   "notecard": [
 *     "59425eda5ee41e268c9dec3a",
 *     "59425ee05ee41e268c9dec3c"
 *   ]
 * }
 */
function removeCardsAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else if (req.body === null || req.body.notecards === undefined) {
    res.send(BODY_EMPTY);
  } else {
    dbmodel.set.findById(req.params.id, (err, set) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else if (set.owner.toString() === req.auth0.id) {
        dbmodel.set.removeNotecards(req.params.id, req.body.notecards, (err1, result) => {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(result);
            activityController.createActivityForFollower(req.auth0, 'set_update');
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

export default {
  getAllAction,
  getByIdAction,
  createAction,
  updateAction,
  deleteAction,
  addCardsAction,
  removeCardsAction,
};
