import dbmodel from 'bt-mongodb';
import websocket from '../websocket';

// Man kommt nur soweit, wenn man sich authorisiert *hat*. daher wird hier nie
// auf req.auth0.id geprueft.

const CONTACT_ADMIN = 'there was an error, please contact an admin';
const BODY_EMPTY = 'The body was empty';
const NO_OBJECT_ID = 'There was no id in the request';
const NOT_EXISTED_BEFORE = 'Couldn\'t match id to an actual object';
const NOT_OWNER = 'you are not the owner of that object';

function getAllAction(req, res) {
  dbmodel.set.findByOwner(req.auth0.id, (err, sets) => {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else {
      res.send(sets);
    }
  });
}

function getByIdAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    dbmodel.set.findById(req.params.id, (err, set) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(set);
      }
    });
  }
}

function createAction(req, res) {
  if (req.body === null) {
    res.send(BODY_EMPTY);
  } else {
    req.body.owner = req.auth0.id;
    req.lastchange = new Date();
    dbmodel.set.createSet(req.body, (err, newSet) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(newSet);
      }
    });
  }
}

function updateAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else if (req.body === null) {
    res.send(BODY_EMPTY)
  } else {
    dbmodel.set.getByIdAction(req.params.id, (err, set) => {
      if (err) {
        res.send(NOT_EXISTED_BEFORE);
      } else if (set.owner === req.auth0.id) {
        req.body.lastchange = new Date();
        dbmodel.set.updateSet(req.params.id, req.body, (err, changedSet) => {
          if (err) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(changedSet);
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

function deleteAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    dbmodel.set.findById(req.params.id, (err, set) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else if (set.owner === req.auth0.id) {
        dbmodel.set.deleteSet(req.params.id, (err, result) => {
          if (err) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(result);
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

export default { getAllAction, getByIdAction, createAction, updateAction, deleteAction };
