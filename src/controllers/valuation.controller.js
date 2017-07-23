import dbmodel from 'bt-mongodb';

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
  dbmodel.valuation.findAll((err, map) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      const profileIds = [];
      for (let i = 0; i < map.length; i += 1) {
        profileIds.push(map[i].profile);
      }
      dbmodel.profile.findByIds(profileIds, (err1, profiles) => {
        const valuations = [];
        for (let i = 0; i < map.length; i += 1) {
          for (let j = 0; j < profiles.length; j += 1) {
            if (map[i].profile && profiles[j].id === map[i].profile.toString()) {
              const copy = map[i];
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
  dbmodel.valuation.findById(req.params.id, (err, valuation) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      dbmodel.profile.findById(valuation.profile, (err1, profile) => {
        const copy = valuation;
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
  dbmodel.valuation.createValuation(req.body, (err, newValuation) => {
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
  dbmodel.valuation.updateValuation(req.params.id, req.body, (err, changedValuation) => {
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
  dbmodel.valuation.deleteValuation(req.params.id, (err, result) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(result);
    }
  });
}

export default { getAllAction, getByIdAction, createAction, updateAction, deleteAction };
