import Notecard from '../models/notecard.model';

function listCardsAction(req, res) {
  const notecard = new Notecard();
  const data = notecard.getCards();

  res.json(data);
}

function listAction(req, res) {
  res.send('Hallo list!');
}

export default { listCardsAction, listAction };
