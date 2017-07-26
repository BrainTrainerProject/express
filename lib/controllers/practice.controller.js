'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _btMongodb = require('bt-mongodb');

var _btMongodb2 = _interopRequireDefault(_btMongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONTACT_ADMIN = 'there was an error, please contact an admin';
var NOT_OWNER = 'you are not the owner of that object';

function getNextCard(cardsList, statsList) {
  var nextCard = null;
  var rating = 1;

  for (var i = 0; i < cardsList.length; i += 1) {
    var currentCardId = cardsList[i];
    var matchingStat = null;

    for (var j = 0; j < statsList.length; j += 1) {
      if (currentCardId === statsList[j].notecard) {
        matchingStat = statsList[j];
        break;
      }
    }

    if (matchingStat === null) {
      nextCard = currentCardId;
      break;
    } else if (rating > matchingStat.successfultries / matchingStat.totaltries) {
      nextCard = currentCardId;
      rating = matchingStat.successfultries / matchingStat.totaltries;
    }
  }

  return nextCard;
}

function generatePracticeSet(set, owner, amount, callback) {
  _btMongodb2.default.statistic.findByNotecardsAndOwner(set.notecard, owner, function (err, stats) {
    var notecardsCopy = set.notecard.slice();
    var chosenNotecards = [];

    for (var i = 0; i < amount; i += 1) {
      var nextCard = getNextCard(notecardsCopy, stats);

      // add/remove next stat from lists
      if (nextCard) {
        chosenNotecards.push(nextCard);
      }
      var index = notecardsCopy.indexOf(nextCard);
      if (index > -1) {
        notecardsCopy.splice(index, 1);
      }
      if (notecardsCopy.length === 0) {
        notecardsCopy = set.notecard.slice();
      }
    }

    callback(null, chosenNotecards);
  });
}

function randomSetPractice(req, res, cardsPerSession) {
  _btMongodb2.default.set.findByOwner(req.auth0.id, function (err, sets) {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else if (sets.length === 0) {
      var emptyPractice = [];
      res.send(emptyPractice);
    } else {
      var set = sets[Math.floor(Math.random() * sets.length)];
      generatePracticeSet(set, req.auth0.id, cardsPerSession, function (err1, cards) {
        if (err1) {
          res.send(CONTACT_ADMIN);
        } else {
          res.send(cards);
        }
      });
    }
  });
}

/**
 * @api             {get} practice GET random Practice
 * @apiName         GetRandomPractice
 * @apiGroup        practice
 * @apiDescription  Generates a practice of one set of which the authorized
 * profile is the owner. returns an array of ordered id's of notecards. The amount
 * of elements depends on the setting "cardsPerSession" from the profile. If the
 * profile doesn't have any sets an empty JSON array will be send.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * [
 *   "59456137a1a33c3e0c44ad45",
 *   "59456148a1a33c3e0c44ad47",
 *   "5945614fa1a33c3e0c44ad49",
 *   ...
 * ]
 */
function getPracticeAction(req, res) {
  randomSetPractice(req, res, req.auth0.cardsPerSession);
}

/**
 * @api             {get} practice GET random Practice with amount
 * @apiName         GetRandomPracticeWithAmount
 * @apiGroup        practice
 * @apiDescription  Generates a practice of one set of which the authorized
 * profile is the owner. returns an array of ordered id's of notecards. If the
 * profile doesn't have any sets an empty JSON array will be send.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiParam        {Number} amount amount of cards in this practice
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * [
 *   "59456137a1a33c3e0c44ad45",
 *   "59456148a1a33c3e0c44ad47",
 *   "5945614fa1a33c3e0c44ad49",
 *   ...
 * ]
 */
function getPracticeActionWithAmount(req, res) {
  randomSetPractice(req, res, req.params.cardsPerSession);
}

/**
 * @api             {get} practice/set/:id oder set/:id/practice GET random Practice of specific set
 * @apiName         GetRandomPracticeOfSet
 * @apiGroup        practice
 * @apiDescription  Generates a practice of given set of which the authorized
 * profile is the owner. returns an array of ordered id's of notecards. The amount
 * of elements depends on the setting "cardsPerSession" from the profile.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiParam        {Number} id id of targeted set
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * [
 *   "59456137a1a33c3e0c44ad45",
 *   "59456148a1a33c3e0c44ad47",
 *   "5945614fa1a33c3e0c44ad49",
 *   ...
 * ]
 */
function getPracticeBySetIdAction(req, res) {
  _btMongodb2.default.set.findById(req.params.id, function (err, set) {
    if (set.owner.toString() === req.auth0.id) {
      generatePracticeSet(set, req.auth0.id, req.auth0.cardsPerSession, function (err1, cards) {
        res.send(cards);
      });
    } else {
      res.send(NOT_OWNER);
    }
  });
}

/**
 * @api             {get} practice/set/:id/:amount oder set/:id/practice/:amount
  GET random Practice of specific set
 * @apiName         GetRandomPracticeOfSetWithAmount
 * @apiGroup        practice
 * @apiDescription  Generates a practice of given set of which the authorized
 * profile is the owner. returns an array of ordered id's of notecards.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiParam        {Number} id id of targeted set
 * @apiParam        {Number} amount amount of cards in this practice
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 * [
 *   "59456137a1a33c3e0c44ad45",
 *   "59456148a1a33c3e0c44ad47",
 *   "5945614fa1a33c3e0c44ad49",
 *   ...
 * ]
 */
function getPracticeBySetIdAndAmountAction(req, res) {
  _btMongodb2.default.set.findById(req.params.id, function (err, set) {
    if (set.owner.toString() === req.auth0.id) {
      generatePracticeSet(set, req.auth0.id, req.params.cardsPerSession, function (err1, cards) {
        res.send(cards);
      });
    } else {
      res.send(NOT_OWNER);
    }
  });
}

/**
 * @api             {post} practice/evaluate POST evaluate Practice
 * @apiName         PracticeEvaluate
 * @apiGroup        practice
 * @apiDescription  Evaluates the practice. It will create or update statistics
 * for the given practice.
 *
 * @apiHeader       {String} Authorization Bearer JWT Token
 * @apiHeader       {String} Content-Type application/json
 * @apiPermission   AuthToken
 *
 * @apiSuccessExample {json} Request
 * Content-Type: application/json
 * [
 *   { "notecard": "593eaebcf8ac692c4c13b2c1" , "success": true },
 *   ...
 * ]
 *
 * @apiSuccessExample {json} Response 200
 * Content-Type: application/json
 */
function evaluatePractice(req, res) {
  _btMongodb2.default.statistic.findByOwner(req.auth0.id, function (err, stats) {
    var copy = req.body.slice();
    var updatedStats = [];
    var createStats = [];

    // first look for existing statistics
    for (var i = 0; i < stats.length; i += 1) {
      for (var j = 0; j < req.body.length; j += 1) {
        // found and update
        if (stats[i].notecard.toString() === req.body[j].notecard) {
          var stat = stats[i];
          stat.totaltries += 1;
          if (copy[j].success) {
            stat.successfultries += 1;
          }
          updatedStats.push(stat);

          // remove element from copy
          var index = copy.indexOf(stat);
          if (index > -1) {
            copy.splice(index, 1);
          }
        }
      }
    }

    // then create new Stats because they are first time practices
    for (var _i = 0; _i < copy.length; _i += 1) {
      createStats.push({
        profile: req.auth0.id,
        notecard: copy[_i].notecard,
        successfultries: copy[_i].success ? 0 : 1,
        totaltries: 1
      });
    }

    _btMongodb2.default.statistic.updateStatisticMultiple(updatedStats, function (err1, oldStats) {
      console.log(oldStats);
      if (err1) {
        res.send(err1);
      } else {
        _btMongodb2.default.statistic.createStatisticMultiple(createStats, function (err2) {
          if (err2) {
            res.send(err2);
          } else {
            res.send('k');
          }
        });
      }
    });
  });
}

exports.default = {
  getPracticeAction: getPracticeAction,
  getPracticeActionWithAmount: getPracticeActionWithAmount,
  getPracticeBySetIdAction: getPracticeBySetIdAction,
  getPracticeBySetIdAndAmountAction: getPracticeBySetIdAndAmountAction,
  evaluatePractice: evaluatePractice
};