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

/**
 * @api             {get} practice GET random Practice
 * @apiName         GetRandomPractice
 * @apiGroup        practice
 * @apiDescription  Generates a practice of one set of which the authorized
 * profile is the owner. returns an array of ordered id's of notecards. The amount
 * of elements depends on the setting "cardsPerSession" from the profile.
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
  dbmodel.set.findByOwner(req.auth0.id, (err, sets) => {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else {
      const set = sets[Math.floor(Math.random() * sets.length)];
      generatePracticeSet(set, req.auth0.id, req.auth0.cardsPerSession,
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
 * @api             {post} practice POST evaluate Practice
 * @apiName         PracticeEvaluate
 * @apiGroup        practice
 * @apiDescription  Evaluates the practice. It will create or  update statistics
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
 * TODO
 */
function evaluatePractice(req, res) {
  dbmodel.statistic.findByOwner(req.auth0.id, (err, stats) => {
    const copy = req.body.slice();
    const updatedStats = [];
    const createStats = [];

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

    // create new Stats
    for (let i = 0; i < copy.length; i += 1) {
      createStats.push({
        profile: req.auth0.id,
        notecard: copy[i].notecard,
        successfultries: copy[i].success ? 0 : 1,
        totaltries: 1,
      });
    }

    res.send('Not yet implemented');
    // TODO: aktualisierung anstossen
  });
}

export default {
  getPracticeAction,
  getPracticeBySetIdAction,
  evaluatePractice,
};
