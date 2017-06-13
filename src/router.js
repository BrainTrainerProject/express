import express from 'express';
import notecardController from './controllers/notecard.controller';
import setController from './controllers/set.controller';
import profileController from './controllers/profile.controller';
import statisticController from './controllers/statistic.controller';
import valuationController from './controllers/valuation.controller';
import apiauthorization from './middleware/apiauthorization';

const router = express.Router();

router.use(apiauthorization.apiAuth);

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
router.post('/set/:id', setController.addCardsAction);
router.post('/set/:id', setController.removeCardsAction);

router.get('/profile', profileController.getByIdAction);
// Man sollte nicht alle Profile sehen koennen
// router.get('/profile', profileController.getAllAction);
router.post('/profile', profileController.createAction);
router.put('/profile', profileController.updateAction);
router.delete('/profile', profileController.deleteAction);
router.post('/profile/:id/follow', profileController.followAction);
router.post('/profile/:id/unfollow', profileController.unfollowAction);

router.get('/valuation/:id', valuationController.getByIdAction);
router.get('/valuation', valuationController.getAllAction);
router.post('/valuation', valuationController.createAction);
router.put('/valuation/:id', valuationController.updateAction);
router.delete('/valuation/:id', valuationController.deleteAction);

router.get('/statistic/:id', statisticController.getByIdAction);
router.get('/statistic', statisticController.getAllAction);
router.post('/statistic', statisticController.createAction);
router.put('/statistic/:id', statisticController.updateAction);
router.delete('/statistic/:id', statisticController.deleteAction);

export default router;
