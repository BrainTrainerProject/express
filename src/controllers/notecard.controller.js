import dbmodel from 'bt-mongodb';

function listAction(req, res) {
  dbmodel.notecard.findAll((err, map) => {
    res.send(map);
  });
}

export default { listAction };
