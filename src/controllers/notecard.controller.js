import dbmodel from 'bt-mongodb';
import websocket from '../websocket';

// req.auth0 = profile;
function getAllAction(req, res) {
  dbmodel.notecard.findByOwner(req.auth0.id, (err, map) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(map);
    }
  });
}

function getByIdAction(req, res) {
  dbmodel.notecard.findById(req.params.id, (err, card) => {
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
  // TODO: new Date() auf das Feld lastchange
  dbmodel.notecard.createNotecard(req.body, (err, newCard) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(newCard);
      websocket.notify('new card', JSON.stringify(newCard));
    }
  });
}

function updateAction(req, res) {
  // TODO: new Date() auf das Feld lastchange
  dbmodel.notecard.updateNotecard(req.params.id, req.body, (err, changedCard) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(changedCard);
    }
  });
}

function deleteAction(req, res) {
  dbmodel.notecard.deleteNotecard(req.params.id, (err, result) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(result);
    }
  });
}

export default { getAllAction, getByIdAction, createAction, updateAction, deleteAction };
