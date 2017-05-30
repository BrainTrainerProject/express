import dbmodel from 'bt-mongodb';

function getAllAction(req, res) {
  dbmodel.set.findAll((err, map) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(map);
    }
  });
}

function getByIdAction(req, res) {
  dbmodel.set.findById(req.params.id, (err, card) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(card);
    }
  });
}

function createAction(req, res) {
  // TODO: Aus sicherheitstechnischen Gruenden wuerde man eigentlich req.body filtern
  dbmodel.set.createSet(req.body, (err, newSet) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(newSet);
    }
  });
}

function updateAction(req, res) {
  dbmodel.set.updateSet(req.params.id, req.body, (err, changedSet) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(changedSet);
    }
  });
}

function deleteAction(req, res) {
  dbmodel.set.deleteSet(req.params.id, (err, result) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(result);
    }
  });
}

export default { getAllAction, getByIdAction, createAction, updateAction, deleteAction };
