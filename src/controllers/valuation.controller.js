import dbmodel from 'bt-mongodb';

function getAllAction(req, res) {
  dbmodel.valuation.findAll((err, map) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(map);
    }
  });
}

function getByIdAction(req, res) {
  dbmodel.valuation.findById(req.params.id, (err, valuation) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(valuation);
    }
  });
}

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
