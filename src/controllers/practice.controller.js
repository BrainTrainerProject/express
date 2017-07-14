import dbmodel from 'bt-mongodb';

const CONTACT_ADMIN = 'there was an error, please contact an admin';
const NOT_OWNER = 'you are not the owner of that object';

function getNextCard(cardsList, statsList) {
  let nextCard = null;
  let rating = 1;

  for (let i = 0; i < cardsList.length; i += 1) {
    const currentCardId = cardsList[i];
    let matchingStat = null;

    for (let j = 0; j < statsList.length; j += 1) {
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
  dbmodel.statistic.findByNotecardsAndOwner(set.notecard, owner, (err, stats) => {
    let notecardsCopy = set.notecard.slice();
    const chosenNotecards = [];

    for (let i = 0; i < amount; i += 1) {
      const nextCard = getNextCard(notecardsCopy, stats);

      // add/remove next stat from lists
      if (nextCard) {
        chosenNotecards.push(nextCard);
      }
      const index = notecardsCopy.indexOf(nextCard);
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
  dbmodel.set.findByOwner(req.auth0.id, (err, sets) => {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else if (sets.length === 0) {
      const emptyPractice = [];
      res.send(emptyPractice);
    } else {
      const set = sets[Math.floor(Math.random() * sets.length)];
      generatePracticeSet(set, req.auth0.id, cardsPerSession,
        (err1, cards) => {
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
  dbmodel.set.findById(req.params.id, (err, set) => {
    if (set.owner.toString() === req.auth0.id) {
      generatePracticeSet(set, req.auth0.id, req.auth0.cardsPerSession, (err1, cards) => {
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
  dbmodel.set.findById(req.params.id, (err, set) => {
    if (set.owner.toString() === req.auth0.id) {
      generatePracticeSet(set, req.auth0.id, req.params.cardsPerSession, (err1, cards) => {
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
  dbmodel.statistic.findByOwner(req.auth0.id, (err, stats) => {
    const copy = req.body.slice();
    const updatedStats = [];
    const createStats = [];

    // first look for existing statistics
    for (let i = 0; i < stats.length; i += 1) {
      for (let j = 0; j < req.body.length; j += 1) {
        // found and update
        if (stats[i].notecard.toString() === req.body[j].notecard) {
          const stat = stats[i];
          stat.totaltries += 1;
          if (copy[j].success) {
            stat.successfultries += 1;
          }
          updatedStats.push(stat);

          // remove element from copy
          const index = copy.indexOf(stat);
          if (index > -1) {
            copy.splice(index, 1);
          }
        }
      }
    }

    // then create new Stats because they are first time practices
    for (let i = 0; i < copy.length; i += 1) {
      createStats.push({
        profile: req.auth0.id,
        notecard: copy[i].notecard,
        successfultries: copy[i].success ? 0 : 1,
        totaltries: 1,
      });
    }

    dbmodel.statistic.updateStatisticMultiple(updatedStats, (err1, oldStats) => {
      console.log(oldStats);
      if (err1) {
        res.send(err1);
      } else {
        dbmodel.statistic.createStatisticMultiple(createStats, (err2) => {
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

export default {
  getPracticeAction,
  getPracticeActionWithAmount,
  getPracticeBySetIdAction,
  getPracticeBySetIdAndAmountAction,
  evaluatePractice,
};
