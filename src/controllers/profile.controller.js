import dbmodel from 'bt-mongodb';

function getAllAction(req, res) {
  dbmodel.profile.findAll((err, map) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(map);
    }
  });
}

function getByIdAction(req, res) {
  dbmodel.profile.findById(req.params.id, (err, profile) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(profile);
    }
  });
}

function createAction(req, res) {
  // TODO: Aus sicherheitstechnischen Gruenden wuerde man eigentlich req.body filtern
  dbmodel.profile.createProfile(req.body, (err, newProfile) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(newProfile);
    }
  });
}

function updateAction(req, res) {
  dbmodel.profile.updateProfile(req.params.id, req.body, (err, changedProfile) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(changedProfile);
    }
  });
}

function deleteAction(req, res) {
  dbmodel.profile.deleteProfile(req.params.id, (err, result) => {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(result);
    }
  });
}

export default { getAllAction, getByIdAction, createAction, updateAction, deleteAction };
