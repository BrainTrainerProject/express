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
        websocket.notify('set_new', JSON.stringify(newSet));
      }
    });
  }
}

function updateAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else if (req.body === null) {
    res.send(BODY_EMPTY);
  } else {
    dbmodel.set.getByIdAction(req.params.id, (err, set) => {
      if (err) {
        res.send(NOT_EXISTED_BEFORE);
      } else if (set.owner === req.auth0.id) {
        req.body.lastchange = new Date();
        dbmodel.set.updateSet(req.params.id, req.body, (err1, changedSet) => {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(changedSet);
            websocket.notify('set_update', JSON.stringify(changedSet));
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
        dbmodel.set.deleteSet(req.params.id, (err1, result) => {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(result);
            websocket.notify('set_delete', JSON.stringify(result));
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

function addCardsAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else if (req.body === null) {
    res.send(BODY_EMPTY);
  } else {
    // TODO
    res.send('Not yet implemented');
  }
}

function removeCardsAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else if (req.body === null) {
    res.send(BODY_EMPTY);
  } else {
    // TODO
    res.send('Not yet implemented');
  }
}

export default {
  getAllAction,
  getByIdAction,
  createAction,
  updateAction,
  deleteAction,
  addCardsAction,
  removeCardsAction,
};
