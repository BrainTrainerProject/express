'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _notecard = require('./controllers/notecard.controller');

var _notecard2 = _interopRequireDefault(_notecard);

var _set = require('./controllers/set.controller');

var _set2 = _interopRequireDefault(_set);

var _profile = require('./controllers/profile.controller');

var _profile2 = _interopRequireDefault(_profile);

var _statistic = require('./controllers/statistic.controller');

var _statistic2 = _interopRequireDefault(_statistic);

var _valuation = require('./controllers/valuation.controller');

var _valuation2 = _interopRequireDefault(_valuation);

var _activity = require('./controllers/activity.controller');

var _activity2 = _interopRequireDefault(_activity);

var _practice = require('./controllers/practice.controller');

var _practice2 = _interopRequireDefault(_practice);

var _apiauthorization = require('./middleware/apiauthorization');

var _apiauthorization2 = _interopRequireDefault(_apiauthorization);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use(_apiauthorization2.default.apiAuth);

router.get('/notecard/:id', _notecard2.default.getByIdAction);
router.get('/notecard', _notecard2.default.getAllAction);
router.post('/notecard', _notecard2.default.createAction);
router.post('/notecard/set/:id', _notecard2.default.createAndAppendAction);
router.put('/notecard/:id', _notecard2.default.updateAction);
router.delete('/notecard/:id', _notecard2.default.deleteAction);

router.get('/set/search', _set2.default.searchAction);
router.get('/set/:id', _set2.default.getByIdAction);
router.get('/set', _set2.default.getAllAction);
router.get('/set/profile/:id', _set2.default.getByProfileAction);
router.post('/set', _set2.default.createAction);
router.put('/set/:id', _set2.default.updateAction);
router.delete('/set/:id', _set2.default.deleteAction);
router.post('/set/:id/addCards', _set2.default.addCardsAction);
router.post('/set/:id/removeCards', _set2.default.removeCardsAction);
router.post('/set/:id/addTags', _set2.default.addTagsAction);
router.post('/set/:id/removeTags', _set2.default.removeTagsAction);
router.get('/set/:id/practice', _practice2.default.getPracticeBySetIdAction);
router.get('/set/:id/practice/:cardsPerSession', _practice2.default.getPracticeBySetIdAndAmountAction);
router.post('/set/:id/evaluate', _set2.default.createEvaluationAction);
router.get('/set/:id/import', _set2.default.importAction);

router.get('/profile', _profile2.default.getByOwnerAction);
router.get('/profile/:id/set', _set2.default.getByProfileAction);
router.get('/profile/:id', _profile2.default.getByIdAction);
// router.post('/profile', profileController.createAction);
router.put('/profile', _profile2.default.updateAction);
// router.delete('/profile', profileController.deleteAction);
router.post('/profile/:id/follow', _profile2.default.followAction);
router.post('/profile/:id/unfollow', _profile2.default.unfollowAction);

router.get('/valuation/:id', _valuation2.default.getByIdAction);
router.get('/valuation', _valuation2.default.getAllAction);
router.post('/valuation', _valuation2.default.createAction);
router.put('/valuation/:id', _valuation2.default.updateAction);
router.delete('/valuation/:id', _valuation2.default.deleteAction);

router.get('/statistic/:id', _statistic2.default.getByIdAction);
router.get('/statistic', _statistic2.default.getAllAction);
router.post('/statistic', _statistic2.default.createAction);
router.put('/statistic/:id', _statistic2.default.updateAction);
router.delete('/statistic/:id', _statistic2.default.deleteAction);

router.get('/activity/:page', _activity2.default.pageActivityAction);
router.get('/activity/:id/:page', _activity2.default.pageActivityByIdAction);

router.get('/practice', _practice2.default.getPracticeAction);
router.get('/practice/:cardsPerSession', _practice2.default.getPracticeActionWithAmount);
router.get('/practice/set/:id', _practice2.default.getPracticeBySetIdAction);
router.get('/practice/set/:id/:cardsPerSession', _practice2.default.getPracticeBySetIdAndAmountAction);
router.post('/practice/evaluate', _practice2.default.evaluatePractice);

exports.default = router;