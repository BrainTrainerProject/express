import dbmodel from 'bt-mongodb';

function getAllAction(req, res) {
  dbmodel.statistic.findAll((err, map) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(map);
    }
  });
}

function getByIdAction(req, res) {
  dbmodel.statistic.findById(req.params.id, (err, statistic) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(statistic);
    }
  });
}

function createAction(req, res) {
  // TODO: Aus sicherheitstechnischen Gruenden wuerde man eigentlich req.body filtern
  dbmodel.statistic.createStatistic(req.body, (err, newStatistic) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(newStatistic);
    }
  });
}

function updateAction(req, res) {
  dbmodel.statistic.updateStatistic(req.params.id, req.body, (err, changedStatistic) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(changedStatistic);
    }
  });
}

function deleteAction(req, res) {
  dbmodel.statistic.deleteStatistic(req.params.id, (err, result) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(result);
    }
  });
}

export default { getAllAction, getByIdAction, createAction, updateAction, deleteAction };
