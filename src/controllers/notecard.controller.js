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
  dbmodel.notecard.findByOwner(req.auth0.id, (err, map) => {
    if (err) {
      res.send(CONTACT_ADMIN);
    } else {
      res.send(map);
    }
  });
}

function getByIdAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    dbmodel.notecard.findById(req.params.id, (err, card) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(card);
      }
    });
  }
}

function createAction(req, res) {
  if (req.body === null) {
    res.send(BODY_EMPTY);
  } else {
    req.body.owner = req.auth0.id;
    req.body.lastchange = new Date();
    dbmodel.notecard.createNotecard(req.body, (err, newCard) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(newCard);
        websocket.notify('notecard_new', JSON.stringify(newCard));
      }
    });
  }
}

function createAndAppendAction(req, res) {
  if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else if (req.body === null) {
    res.send(BODY_EMPTY);
  } else {
    dbmodel.set.findById(req.params.id, (err, set) => {
      if (err) {
        res.send(NOT_EXISTED_BEFORE);
      } else {
        req.body.owner = req.auth0.id;
        req.body.lastchange = new Date();
        dbmodel.notecard.createNotecard(req.body, (err, newCard) => {
          if (err) {
            res.send(CONTACT_ADMIN);
          } else {
            // TODO karte dem set hinzufuegen
            res.send(newCard);
            websocket.notify('notecard_new', JSON.stringify(newCard));
          }
        });
      }
    });
  }
}

function updateAction(req, res) {
  if (req.body === null) {
    res.send(BODY_EMPTY);
  } else if (req.params === null || req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    dbmodel.notecard.findById(req.params.id, (err, card) => {
      if (err) {
        res.send(NOT_EXISTED_BEFORE);
      } else if (card.owner === req.auth0.id) {
        req.body.lastchange = new Date();
        dbmodel.notecard.updateNotecard(req.params.id, req.body, (err1, changedCard) => {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(changedCard);
            websocket.notify('notecard_update', JSON.stringify(changedCard));
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
    dbmodel.notecard.findById(req.params.id, (err, card) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else if (card.id === req.auth0.id) {
        dbmodel.notecard.deleteNotecard(req.params.id, (err1, result) => {
          if (err1) {
            res.send(CONTACT_ADMIN);
          } else {
            res.send(result);
            websocket.notify('notecard_delete', JSON.stringify(result));
          }
        });
      } else {
        res.send(NOT_OWNER);
      }
    });
  }
}

export default {
  getAllAction,
  getByIdAction,
  createAction,
  updateAction,
  deleteAction,
  createAndAppendAction
};
