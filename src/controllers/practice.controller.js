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

/* function getNextStat(statsList) {
  let nextStat = null;

  for (let j = 0; j < statsList.length; j += 1) {
    const rating = statsList[j].successfultries / statsList[j].totaltries;
    if (nextStat === null) {
      nextStat = statsList[j];
    } else if (statsList[j].totaltries === 0 || statsList[j].successfultries === 0) {
      nextStat = statsList[j];
    } else if (rating < nextStat.successfultries / nextStat.totaltries) {
      nextStat = statsList[j];
    }
  }

  return nextStat;
}*/

function generatePracticeSet(set, owner, amount, callback) {
  dbmodel.statistic.findByNotecardsAndOwner(set.notecard, owner, (err, stats) => {
    // let statsCopy = stats.slice();
    let notecardsCopy = set.notecard.slice();
    const chosenNotecards = [];

    for (let i = 0; i < amount; i += 1) {
      // const nextStat = getNextStat(statsCopy);
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

export default {
  getPracticeAction,
  getPracticeBySetIdAction,
};
