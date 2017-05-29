import express from 'express';
import notecardController from './controllers/notecard.controller';
// import apiauthorization from './middleware/apiauthorization';

const router = express.Router();

// router.use(apiauthorization);

router.get('/notecard/:id', notecardController.getByIdAction);
router.get('/notecard', notecardController.getAllAction);
router.post('/notecard', notecardController.createAction);
router.put('/notecard/:id', notecardController.updateAction);
router.delete('/notecard/:id', notecardController.deleteAction);

router.get('/set', (req, res) => {
  res.send('Not yet implemented');
});
router.post('/set', (req, res) => {
  res.send('Not yet implemented');
});
router.put('/set', (req, res) => {
  res.send('Not yet implemented');
});
router.delete('/set', (req, res) => {
  res.send('Not yet implemented');
});

router.get('/profile', (req, res) => {
  res.send('Not yet implemented');
});
router.post('/profile', (req, res) => {
  res.send('Not yet implemented');
});
router.put('/profile', (req, res) => {
  res.send('Not yet implemented');
});
router.delete('/profile', (req, res) => {
  res.send('Not yet implemented');
});

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
