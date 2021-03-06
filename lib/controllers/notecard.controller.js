'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _btMongodb = require('bt-mongodb');

var _btMongodb2 = _interopRequireDefault(_btMongodb);

var _activity = require('./activity.controller');

var _activity2 = _interopRequireDefault(_activity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONTACT_ADMIN = 'there was an error, please contact an admin';
var BODY_EMPTY = 'The body was empty';
var NO_OBJECT_ID = 'There was no id in the request';
var NOT_EXISTED_BEFORE = 'Couldn\'t match id to an actual object';
var NOT_OWNER = 'you are not the owner of that object';

/**
 * @api             {get} notecard GET owned Notecards
 * @apiName         GetAllNotecards
 * @apiGroup        notecard
 * @apiDescription  Collects all the notecards of which the authorizated profile
 * has access to and returns them in a json response.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * [
 *   {
 *     "_id": "593eaebcf8ac692c4c13b2c1",
 *     "title": "Lorem Ipsum",
 *     "task": "Dolor Sit",
 *     "answer": "Ahmet",
 *     "owner": "593eaa0bcf7f5000011c24c4",
 *     "lastchange": "2017-06-12T15:58:37.406Z",
 *     "__v": 0
 *   },...
 * ]
 */
function getAllAction(req, res) {
  _btMongodb2.default.notecard.findByOwner(req.auth0.id, function (err, map) {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else {
      res.send(map);
    }
  });
}

/**
 * @api             {get} notecard/:id GET specific Notecard
 * @apiName         GetSpecificNotecards
 * @apiGroup        notecard
 * @apiDescription  Returns the Notecard with the given id.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiParam        {Number} id id of the notecard
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   "_id": "593eaebcf8ac692c4c13b2c1",
 *   "title": "Lorem Ipsum",
 *   "task": "Dolor Sit",
 *   "answer": "Ahmet",
 *   "owner": "593eaa0bcf7f5000011c24c4",
 *   "__v": 0
 * }
 */
function getByIdAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    _btMongodb2.default.notecard.findById(req.params.id, function (err, card) {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(card);
      }
    });
  }
}

/**
 * @api             {post} notecard POST Notecard
 * @apiName         PostNotecard
 * @apiGroup        notecard
 * @apiDescription  Creates a Notecard of the given json body.
 * Owner and the date of creation will be set automatically.
 * Emits the notecard_new event on the websocket for follower.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiHeader       {String} Content-Type application/json
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * Content-Type: application/json
 * {
 *   "title": "Lorem Ipsum",
 *   "task": "Dolor Sit",
 *   "answer": "Ahmet"
 * }
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   "__v": 0,
 *   "title": "Lorem Ipsum",
 *   "task": "Dolor Sit",
 *   "answer": "Ahmet",
 *   "owner": "593eaa0bcf7f5000011c24c4",
 *   "lastchange": "2017-06-13T17:08:53.703Z",
 *   "_id": "59401c25b5746212889f54f9"
 * }
 */
function createAction(req, res) {
  if (req.body === null) {
    res.send(BODY_EMPTY);
  } else {
    req.body.owner = req.auth0.id;
    req.body.lastchange = new Date();
    _btMongodb2.default.notecard.createNotecard(req.body, function (err, newCard) {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(newCard);
        _activity2.default.createActivityForFollower(req.auth0, 'notecard_new');
      }
    });
  }
}

/**
 * @api             {post} notecard/set/:id POST Notecard and Append to Set
 * @apiName         PostNotecardAppend
 * @apiGroup        notecard
 * @apiDescription  Creates a Notecard of the given json body.
 * Owner and the date of creation will be set automatically. It will be appended
 * to the Set of the given id.
 * Emits the notecard_new event on the websocket for follower.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiParam        {Number} id id of the Set on which the newly created
 * Notecard will be appended to.
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * Content-Type: application/json
 * {
 *   "title": "Lorem Ipsum",
 *   "task": "Dolor Sit",
 *   "answer": "Ahmet"
 * }
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   "__v": 0,
 *   "title": "Lorem Ipsum",
 *   "task": "Dolor Sit",
 *   "answer": "Ahmet",
 *   "owner": "593eaa0bcf7f5000011c24c4",
 *   "lastchange": "2017-06-13T17:08:53.703Z",
 *   "_id": "59401c25b5746212889f54f9"
 * }
 */
function createAndAppendAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else if (req.body === null) {
    res.send(BODY_EMPTY);
  } else {
    _btMongodb2.default.set.findById(req.params.id, function (err, set) {
      if (err) {
        res.send(NOT_EXISTED_BEFORE);
      } else if (set) {
        req.body.owner = req.auth0.id;
        req.body.lastchange = new Date();
        _btMongodb2.default.notecard.createNotecard(req.body, function (err1, newCard) {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else if (newCard) {
            _btMongodb2.default.set.addNotecards(req.params.id, [newCard.id], function (err2) {
              if (err2) {
                res.send(CONTACT_ADMIN);
              } else {
                res.send(newCard);
                _activity2.default.createActivityForFollower(req.auth0, 'notecard_new');
              }
            });
          }
        });
      }
    });
  }
}

/**
 * @api             {put} notecard/:id PUT Notecard
 * @apiName         PutNotecard
 * @apiGroup        notecard
 * @apiDescription  Updates a Notecard with the given json body.
 * Owner and the date of lastchange will be set automatically.
 * Emits the notecard_update event on the websocket for follower.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiParam        {Number} id id of the Notecard which will be updated
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * Content-Type: application/json
 * {
 *   "title": "Lorem Ipsum1",
 *   "task": "Dolor Sit2",
 *   "answer": "Ahmet3",
 *   "owner": "593eaa0bcf7f5000011c24c4"
 * }
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   "_id": "59401de1b5746212889f54fa",
 *   "title": "Lorem Ipsum1",
 *   "task": "Dolor Sit2",
 *   "answer": "Ahmet3",
 *   "owner": "593eaa0bcf7f5000011c24c4",
 *   "lastchange": "2017-06-13T17:47:22.826Z",
 *   __v": 0
 * }
 */
function updateAction(req, res) {
  if (req.body === null) {
    res.send(BODY_EMPTY);
  } else if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    _btMongodb2.default.notecard.findById(req.params.id, function (err, card) {
      if (err) {
        res.send(NOT_EXISTED_BEFORE);
      } else if (card.owner.toString() === req.auth0.id) {
        req.body.lastchange = new Date();
        _btMongodb2.default.notecard.updateNotecard(req.params.id, req.body, function (err1, changedCard) {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(changedCard);
            _activity2.default.createActivityForFollower(req.auth0, 'notecard_update');
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

/**
 * @api             {delete} notecard/:id DELETE Notecard
 * @apiName         DeleteNotecard
 * @apiGroup        notecard
 * @apiDescription  Deletes a Notecard.
 * Emits the notecard_delete event on the websocket for follower.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiParam        {Number} id id of the Notecard which will be deleted
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * {
 *   "_id": "59401de1b5746212889f54fa",
 *   "title": "Lorem Ipsum1",
 *   "task": "Dolor Sit2",
 *   "answer": "Ahmet3",
 *   "owner": "593eaa0bcf7f5000011c24c4",
 *   "lastchange": "2017-06-13T17:47:22.826Z",
 *   "__v": 0
 * }
 */
function deleteAction(req, res) {
  // TODO alle Referenzen entfernen
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    _btMongodb2.default.notecard.findById(req.params.id, function (err, card) {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else if (card && card.owner.toString() === req.auth0.id) {
        _btMongodb2.default.notecard.deleteNotecard(req.params.id, function (err1, result) {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(result);
            _activity2.default.createActivityForFollower(req.auth0, 'notecard_delete');
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

exports.default = {
  getAllAction: getAllAction,
  getByIdAction: getByIdAction,
  createAction: createAction,
  updateAction: updateAction,
  deleteAction: deleteAction,
  createAndAppendAction: createAndAppendAction
};