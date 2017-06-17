import dbmodel from 'bt-mongodb';

const NOT_OWNER = 'you are not the owner of that object';

function getNextStat(statsList) {
  let nextStat = null;

  for (let j = 0; j < statsList.length; j += 1) {
    const rating = statsList[j].successfultries / statsList[j].totaltries;
    if (nextStat === null) {
      nextStat = statsList[j];
    } else if (rating < nextStat.successfultries / nextStat.totaltries) {
      nextStat = statsList[j];
    }
  }

  return nextStat;
}

function generatePracticeSet(set, owner, amount, callback) {
  const temp = [];
  for (let i = 0; i < set.notecard.length; i += 1) {
    temp.push(set.notecard[i].toString());
  }
  dbmodel.statistic.findByNotecardsAndOwner(temp, owner, (err, stats) => {
    let statsCopy = stats.slice();
    const chosenNotecards = [];

    for (let i = 0; i < amount; i += 1) {
      const nextStat = getNextStat(statsCopy);

      // add/remove next stat from lists
      if (nextStat) {
        chosenNotecards.push(nextStat.notecard.toString());
      }
      const index = statsCopy.indexOf(nextStat);
      if (index > -1) {
        statsCopy.splice(index, 1);
      }
      if (statsCopy.length === 0) {
        statsCopy = stats.slice();
      }
    }

    callback(null, chosenNotecards);
  });
}

function startPracticeAction(req, res) {
  dbmodel.set.findByOwner(req.auth0.id, (err, sets) => {
    for (let i = 0; i < sets.length; i += 1) {
      // TODO
      res.send('Not yet implemented');
    }
  });
}

function startPracticeBySetIdAction(req, res) {
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

function getAction(req, res) {
  console.log(req.auth0.id);
  dbmodel.statistic.findByOwner(req.auth0.id, (err, statistics) => {
    if (err) {
      res.send(err);
    } else {
      res.send(statistics);
    }
  });
}

export default {
  startPracticeAction,
  startPracticeBySetIdAction,
  getAction,
};
