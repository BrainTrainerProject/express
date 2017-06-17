import express from 'express';
import notecardController from './controllers/notecard.controller';
import setController from './controllers/set.controller';
import profileController from './controllers/profile.controller';
import statisticController from './controllers/statistic.controller';
import valuationController from './controllers/valuation.controller';
import activityController from './controllers/activity.controller';
import practiceController from './controllers/practice.controller';
import apiauthorization from './middleware/apiauthorization';

const router = express.Router();

router.use(apiauthorization.apiAuth);

router.get('/notecard/:id', notecardController.getByIdAction);
router.get('/notecard', notecardController.getAllAction);
router.post('/notecard', notecardController.createAction);
router.post('notecard/set/:id', notecardController.createAndAppendAction);
router.put('/notecard/:id', notecardController.updateAction);
router.delete('/notecard/:id', notecardController.deleteAction);

router.get('/set/:id', setController.getByIdAction);
router.get('/set', setController.getAllAction);
router.post('/set', setController.createAction);
router.put('/set/:id', setController.updateAction);
router.delete('/set/:id', setController.deleteAction);
router.post('/set/:id/addCards', setController.addCardsAction);
router.post('/set/:id/removeCards', setController.removeCardsAction);
router.post('/set/:id/addTags', setController.addTagsAction);
router.post('/set/:id/removeTags', setController.removeTagsAction);

router.get('/profile', profileController.getByIdAction);
// router.get('/profile', profileController.getAllAction);
// router.post('/profile', profileController.createAction);
router.put('/profile', profileController.updateAction);
// router.delete('/profile', profileController.deleteAction);
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

router.get('/activity/:page', activityController.pageActivityAction);

router.get('/practice', practiceController.startPracticeAction);
router.get('/practice/set/:id', practiceController.startPracticeBySetIdAction);
// router.get('/practice', practiceController.getAction);

export default router;
