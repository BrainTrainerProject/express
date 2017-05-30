import express from 'express';
import notecardController from './controllers/notecard.controller';
import setController from './controllers/set.controller';
import profileController from './controllers/profile.controller';
// import apiauthorization from './middleware/apiauthorization';

const router = express.Router();

// router.use(apiauthorization);

router.get('/notecard/:id', notecardController.getByIdAction);
router.get('/notecard', notecardController.getAllAction);
router.post('/notecard', notecardController.createAction);
router.put('/notecard/:id', notecardController.updateAction);
router.delete('/notecard/:id', notecardController.deleteAction);

router.get('/set/:id', setController.getByIdAction);
router.get('/set', setController.getAllAction);
router.post('/set', setController.createAction);
router.put('/set/:id', setController.updateAction);
router.delete('/set/:id', setController.deleteAction);

router.get('/profile/:id', profileController.getByIdAction);
router.get('/profile', profileController.getAllAction);
router.post('/profile', profileController.createAction);
router.put('/profile/:id', profileController.updateAction);
router.delete('/profile/:id', profileController.deleteAction);

router.get('/valuation', (req, res) => {
  res.send('Not yet implemented');
});
router.post('/valuation', (req, res) => {
  res.send('Not yet implemented');
});
router.put('/valuation', (req, res) => {
  res.send('Not yet implemented');
});
router.delete('/valuation', (req, res) => {
  res.send('Not yet implemented');
});

router.get('/statistic', (req, res) => {
  res.send('Not yet implemented');
});
router.post('/statistic', (req, res) => {
  res.send('Not yet implemented');
});
router.put('/statistic', (req, res) => {
  res.send('Not yet implemented');
});
router.delete('/statistic', (req, res) => {
  res.send('Not yet implemented');
});

export default router;
