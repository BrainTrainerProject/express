import dbmodel from 'bt-mongodb';
import websocket from '../websocket';

// Man kommt nur soweit, wenn man sich authorisiert *hat*. daher wird hier nie
// auf req.auth0.id geprueft.

const CONTACT_ADMIN = 'there was an error, please contact an admin';
const BODY_EMPTY = 'The body was empty';
const NO_OBJECT_ID = 'There was no id in the request';

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
  if (req.params.id === null) {
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

function updateAction(req, res) {
  if (req.body === null) {
    res.send(BODY_EMPTY);
  } else if (req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    req.body.lastchange = new Date();
    dbmodel.notecard.updateNotecard(req.params.id, req.body, (err, changedCard) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(changedCard);
        websocket.notify('notecard_update', JSON.stringify(changedCard));
      }
    });
  }
}

function deleteAction(req, res) {
  if (req.params.id === null) {
    res.send(NO_OBJECT_ID);
  } else {
    dbmodel.notecard.deleteNotecard(req.params.id, (err, result) => {
      if (err) {
        res.send(CONTACT_ADMIN);
      } else {
        res.send(result);
        websocket.notify('notecard_delete', JSON.stringify(result));
      }
    });
  }
}

export default { getAllAction, getByIdAction, createAction, updateAction, deleteAction };
