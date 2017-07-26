'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _btMongodb = require('bt-mongodb');

var _btMongodb2 = _interopRequireDefault(_btMongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @api             {get} valuation GET Valuations
 * @apiName         GetAllValuations
 * @apiGroup        valuation
 * @apiDescription  finds all valuations
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * [
 *   {
 *     "_id": "59468275d0b321046c2522bc",
 *     "score": 1,
 *     "comment": "war kacke",
 *     "profile": {
 *       "_id": "594287b2dec5c60001a2a0da",
 *       "email": "twiens@fh-bielefeld1.de",
 *       "oauthtoken": "auth0|594287b1160ddf59f42b8915",
 *       "photourl": "https://s.gravatar.com/avatar/1599b24e128de6968cfa44fb88c6f140?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Ftw.png",
 *       "visibility": false,
 *       "interval": 30,
 *       "cardsPerSession": 15,
 *       "__v": 0,
 *       "sets": [],
 *       "follower": [
 *         "5942637d16560b00013afd9d"
 *       ]
 *     },
 *     "createdAt": "2017-06-18T13:39:01.224Z",
 *     "__v": 0
 *   },
 * ]
 */
function getAllAction(req, res) {
  _btMongodb2.default.valuation.findAll(function (err, map) {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      var profileIds = [];
      for (var i = 0; i < map.length; i += 1) {
        profileIds.push(map[i].profile);
      }
      _btMongodb2.default.profile.findByIds(profileIds, function (err1, profiles) {
        var valuations = [];
        for (var _i = 0; _i < map.length; _i += 1) {
          for (var j = 0; j < profiles.length; j += 1) {
            if (map[_i].profile && profiles[j].id === map[_i].profile.toString()) {
              var copy = map[_i];
              copy.profile = profiles[j];
              valuations.push(copy);
            }
          }
        }
        res.send(valuations);
      });
    }
  });
}

/**
 * @api             {get} valuation GET ValuationsById
 * @apiName         GetValuationsById
 * @apiGroup        valuation
 * @apiDescription  finds all valuations
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiParam        {Number} id id of the valuation
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   "_id": "59468275d0b321046c2522bc",
 *   "score": 1,
 *   "comment": "war kacke",
 *   "profile": {
 *     "_id": "594287b2dec5c60001a2a0da",
 *     "email": "twiens@fh-bielefeld1.de",
 *     "oauthtoken": "auth0|594287b1160ddf59f42b8915",
 *     "photourl": "https://s.gravatar.com/avatar/1599b24e128de6968cfa44fb88c6f140?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Ftw.png",
 *     "visibility": false,
 *     "interval": 30,
 *     "cardsPerSession": 15,
 *     "__v": 0,
 *     "sets": [],
 *     "follower": [
 *       "5942637d16560b00013afd9d"
 *     ]
 *   },
 *   "createdAt": "2017-06-18T13:39:01.224Z",
 *   "__v": 0
 * }
 */
function getByIdAction(req, res) {
  _btMongodb2.default.valuation.findById(req.params.id, function (err, valuation) {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      _btMongodb2.default.profile.findById(valuation.profile, function (err1, profile) {
        var copy = valuation;
        copy.profile = profile;
        res.send(valuation);
      });
    }
  });
}

/**
 * @api             {post} valuation POST Valuation
 * @apiName         PostValuation
 * @apiGroup        valuation
 * @apiDescription  bla
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * Content-Type: application/json
 * {
 *   ...
 * }
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   ...
 * }
 */
function createAction(req, res) {
  _btMongodb2.default.valuation.createValuation(req.body, function (err, newValuation) {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(newValuation);
    }
  });
}

/**
 * @api             {put} valuation PUT Valuation
 * @apiName         PutValuation
 * @apiGroup        valuation
 * @apiDescription  bla
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * Content-Type: application/json
 * {
 *   ...
 * }
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   ...
 * }
 */
function updateAction(req, res) {
  _btMongodb2.default.valuation.updateValuation(req.params.id, req.body, function (err, changedValuation) {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(changedValuation);
    }
  });
}

/**
 * @api             {delete} valuation DELETE Valuation
 * @apiName         DeleteValuation
 * @apiGroup        valuation
 * @apiDescription  bla
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * {
 *   ...
 * }
 */
function deleteAction(req, res) {
  _btMongodb2.default.valuation.deleteValuation(req.params.id, function (err, result) {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(result);
    }
  });
}

exports.default = { getAllAction: getAllAction, getByIdAction: getByIdAction, createAction: createAction, updateAction: updateAction, deleteAction: deleteAction };