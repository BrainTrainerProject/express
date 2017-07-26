'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _btMongodb = require('bt-mongodb');

var _btMongodb2 = _interopRequireDefault(_btMongodb);

var _activity = require('./activity.controller');

var _activity2 = _interopRequireDefault(_activity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Man kommt nur soweit, wenn man sich authorisiert *hat*. daher wird hier nie
// auf req.auth0.id geprueft.

var CONTACT_ADMIN = 'there was an error, please contact an admin';
var BODY_EMPTY = 'The body was empty or not fitting';
var NO_OBJECT_ID = 'There was no id in the request';
var NOT_EXISTED_BEFORE = 'Couldn\'t match id to an actual object';
var NOT_OWNER = 'you are not the owner of that object';

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
 * [
 *   {
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
 * ]
 */
function getAllAction(req, res) {
  _btMongodb2.default.set.findByOwner(req.auth0.id, function (err, sets) {
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
    _btMongodb2.default.set.findById(req.params.id, function (err, set) {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(set);
      }
    });
  }
}

/**
 * @api             {get} set/profile/:id or profile/:id/set GET Sets from profile
 * @apiName         GetProfileSets
 * @apiGroup        set
 * @apiDescription  Collects all the sets of which the given profile.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * [
 *   {
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
 * ]
 */
function getByProfileAction(req, res) {
  if (req.params == null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    _btMongodb2.default.set.findByOwner(req.params.id, function (err, sets) {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(sets);
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
    _btMongodb2.default.set.createSet(req.body, function (err, newSet) {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(newSet);
        _activity2.default.createActivityForFollower(req.auth0, 'set_new');
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
 *   "_id": "59402f281704792b4c4a151f",
 *   "owner": "593eaa0bcf7f5000011c24c4",
 *   "lastchange": "2017-06-13T18:53:38.560Z",
 *   "visibility": false,
 *   "photourl": "",
 *   "title": "Never gonna run around",
 *   "description": "and desert you",
 *   "__v": 0,
 *   "valuations": [],
 *   "tags": [ "wuppi", "fluppi", "duppi" ],
 *   "notecard": [ "593eaebcf8ac692c4c13b2c1", "593eba2d2de774329cfc492d" ]
 * }
 */
function updateAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else if (req.body === null) {
    res.send(BODY_EMPTY);
  } else {
    _btMongodb2.default.set.findById(req.params.id, function (err, set) {
      if (err) {
        res.send(NOT_EXISTED_BEFORE);
      } else if (set.owner.toString() === req.auth0.id) {
        req.body.lastchange = new Date();
        _btMongodb2.default.set.updateSet(req.params.id, req.body, function (err1, changedSet) {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(changedSet);
            _activity2.default.createActivityForFollower(req.auth0, 'set_update');
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
    _btMongodb2.default.set.findById(req.params.id, function (err, set) {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else if (set && set.owner.toString() === req.auth0.id) {
        _btMongodb2.default.set.deleteSet(req.params.id, function (err1, result) {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(result);
            _activity2.default.createActivityForFollower(req.auth0, 'set_delete');
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
    _btMongodb2.default.set.findById(req.params.id, function (err, set) {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else if (set.owner.toString() === req.auth0.id) {
        _btMongodb2.default.set.addNotecards(req.params.id, req.body.notecards, function (err1, result) {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(result);
            _activity2.default.createActivityForFollower(req.auth0, 'set_update');
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
    _btMongodb2.default.set.findById(req.params.id, function (err, set) {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else if (set.owner.toString() === req.auth0.id) {
        _btMongodb2.default.set.removeNotecards(req.params.id, req.body.notecards, function (err1, result) {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(result);
            _activity2.default.createActivityForFollower(req.auth0, 'set_update');
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

/**
 * @api             {post} set/:id/addTags POST addTags
 * @apiName         PostSetAddTag
 * @apiGroup        set
 * @apiDescription  Adds given tagss to the set.
 * Emits the set_update event on the websocket for follower.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiParam        {Number} id id of the Set on which the cards will be added
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * {
 *   "tags": [ "duppi",... ]
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
 *     "fluppi",
 *     "duppi"
 *   ],
 *   "notecard": [
 *     "59425eda5ee41e268c9dec3a",
 *     "59425ee05ee41e268c9dec3c"
 *   ]
 * }
 */
function addTagsAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else if (req.body === null || req.body.tags === undefined) {
    res.send(BODY_EMPTY);
  } else {
    _btMongodb2.default.set.findById(req.params.id, function (err, set) {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else if (set.owner.toString() === req.auth0.id) {
        _btMongodb2.default.set.addTags(req.params.id, req.body.tags, function (err1, changedSet) {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(changedSet);
            _activity2.default.createActivityForFollower(req.auth0, 'set_update');
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

/**
 * @api             {post} set/:id/removeTags POST removeTags
 * @apiName         PostSetRemoveTag
 * @apiGroup        set
 * @apiDescription  Removes given tags of the set.
 * Emits the set_update event on the websocket for follower.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiParam        {Number} id id of the Set on which the tags will be removed
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * {
 *   "tags": [ "duppi",... ]
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
 *     "fluppi",
 *     "duppi"
 *   ],
 *   "notecard": [
 *     "59425eda5ee41e268c9dec3a",
 *     "59425ee05ee41e268c9dec3c"
 *   ]
 * }
 */
function removeTagsAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else if (req.body === null || req.body.tags === undefined) {
    res.send(BODY_EMPTY);
  } else {
    _btMongodb2.default.set.findById(req.params.id, function (err, set) {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else if (set.owner.toString() === req.auth0.id) {
        _btMongodb2.default.set.removeTags(req.params.id, req.body.tags, function (err1, changedSet) {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(changedSet);
            _activity2.default.createActivityForFollower(req.auth0, 'set_update');
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

/**
 * @api             {post} set/:id/evaluate POST evaluate
 * @apiName         PostEvaluate
 * @apiGroup        set
 * @apiDescription  Creates a new evaluation for the set.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiParam        {Number} id id of the Set evaluated Set
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * {
 *   "score": 1,
 *   "comment": "war kacke"
 * }
 *
 * @apiSuccessExample {json} Response 200
 * {
 *   "__v": 0,
 *   "score": 1,
 *   "comment": "war kacke",
 *   "profile": "594287b2dec5c60001a2a0da",
 *   "createdAt": "2017-06-18T13:39:01.224Z",
 *   "_id": "59468275d0b321046c2522bc"
 * }
 */
function createEvaluationAction(req, res) {
  req.body.profile = req.auth0.id;
  req.body.createdAt = new Date();
  _btMongodb2.default.valuation.createValuation(req.body, function (err, evalu) {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else {
      _btMongodb2.default.set.addValuations(req.params.id, [evalu.id], function (err1) {
        if (err1) {
          res.send(CONTACT_ADMIN);
        } else {
          res.send(evalu);
        }
      });
    }
  });
}

/**
 * @api             {get} set/:id/import GET Set
 * @apiName         GetSetImport
 * @apiGroup        set
 * @apiDescription  Imports the set.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
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
function importAction(req, res) {
  _btMongodb2.default.set.findById(req.params.id, function (err, set) {
    var bla = set;
    bla.owner = req.auth0.id;
    bla.lastchange = new Date();
    _btMongodb2.default.set.createSet(bla, function (err1, newSet) {
      if (err1) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(newSet);
      }
    });
  });
}

function calcRating(collection, callback) {
  var vals = [];
  for (var i = 0; i < collection.length; i += 1) {
    for (var j = 0; j < collection[i].valuations.length; j += 1) {
      vals.push(collection[i].valuations[j]);
    }
  }

  var toReturn = [];
  _btMongodb2.default.valuation.findByIds(vals, function (err, result) {
    // Fuer jedes Set die bewertung ausrechnen
    for (var _i = 0; _i < collection.length; _i += 1) {
      var vals1 = collection[_i].valuations;
      var scoreP = 0;

      // Ueber die Valuations des Sets die echten Vals finden
      for (var _j = 0; _j < vals1.length; _j += 1) {
        for (var k = 0; k < result.length; k += 1) {
          // gefunden und score berechnen
          if (vals1[_j].toString() === result[k].id) {
            scoreP += result[k].score;
          }
        }
      }

      // Anschließend Mitteln und anhaengen
      if (vals1.length !== 0) {
        scoreP /= vals1.length;
      }
      // ansonsten ist es schon 0

      var temp = collection[_i].toObject();
      temp.rating = scoreP;
      toReturn.push(temp);
    }
    callback(toReturn);
  });
}

function orderByRating(list, sortParam) {
  var sortP = false;
  if (sortParam !== undefined && sortParam.toLowerCase() === 'asc') {
    sortP = true;
  }
  if (sortP) {
    list.sort(function (a, b) {
      return a.rating - b.rating;
    });
  } else {
    list.sort(function (a, b) {
      return b.rating - a.rating;
    });
  }
}

/**
 * @api             {get} set/search?param=:param1,param2&orderBy=:date&sort=:asc GET Set
 * @apiName         GetSetSearch
 * @apiGroup        set
 * @apiDescription  Search for sets
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * [
 *   {
 *     "__v": 0,
 *     "owner": "593eaa0bcf7f5000011c24c4",
 *     "lastchange": "2017-06-13T18:30:00.076Z",
 *     "visibility": true,
 *     "photourl": "",
 *     "title": "Never gonna give you up",
 *     "description": "Never gonna let you down",
 *     "_id": "59402f281704792b4c4a151f",
 *     "valuations": [],
 *     "tags": [ "wuppi", "fluppi" ],
 *     "notecard": [ "593eaebcf8ac692c4c13b2c1" ]
 *   }
 * ]
 */
function searchAction(req, res) {
  var searchParam = req.query.param;
  var sortParam = req.query.sort;
  var orderByParam = req.query.orderBy;

  if (searchParam === undefined) {
    // gib alle öffentlichen aus
    _btMongodb2.default.set.findPublic(function (err, sets) {
      if (err) {
        res.send(err);
      } else {
        calcRating(sets, function (result) {
          orderByRating(result, sortParam);
          res.send(result);
        });
      }
    });
  } else if (orderByParam === undefined) {
    var regex = searchParam.split(',').filter(function (e) {
      return e;
    }).map(function (e) {
      return new RegExp(e + '*', 'i');
    });
    _btMongodb2.default.set.search(regex, false, false, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        calcRating(result, function (result1) {
          res.send(result1);
        });
      }
    });
  } else if (orderByParam.toLowerCase() === 'date') {
    var sortP = false;
    if (sortParam !== undefined && sortParam.toLowerCase() === 'asc') {
      sortP = true;
    }
    var _regex = searchParam.split(',').filter(function (e) {
      return e;
    }).map(function (e) {
      return new RegExp(e + '*', 'i');
    });
    _btMongodb2.default.set.search(_regex, true, sortP, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        calcRating(result, function (result1) {
          res.send(result1);
        });
      }
    });
  } else if (orderByParam.toLowerCase() === 'rating') {
    var _regex2 = searchParam.split(',').filter(function (e) {
      return e;
    }).map(function (e) {
      return new RegExp(e + '*', 'i');
    });
    _btMongodb2.default.set.search(_regex2, false, false, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        calcRating(result, function (result1) {
          orderByRating(result1, sortParam);
          res.send(result1);
        });
      }
    });
  } else {
    res.send('orderBy: date oder rating');
  }
}

exports.default = {
  getAllAction: getAllAction,
  getByIdAction: getByIdAction,
  getByProfileAction: getByProfileAction,
  createAction: createAction,
  updateAction: updateAction,
  deleteAction: deleteAction,
  addCardsAction: addCardsAction,
  removeCardsAction: removeCardsAction,
  addTagsAction: addTagsAction,
  removeTagsAction: removeTagsAction,
  createEvaluationAction: createEvaluationAction,
  importAction: importAction,
  searchAction: searchAction
};