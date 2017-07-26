'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _btMongodb = require('bt-mongodb');

var _btMongodb2 = _interopRequireDefault(_btMongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAllAction(req, res) {
  _btMongodb2.default.statistic.findAll(function (err, map) {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(map);
    }
  });
}

function getByIdAction(req, res) {
  _btMongodb2.default.statistic.findById(req.params.id, function (err, statistic) {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(statistic);
    }
  });
}

function createAction(req, res) {
  _btMongodb2.default.statistic.createStatistic(req.body, function (err, newStatistic) {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(newStatistic);
    }
  });
}

function updateAction(req, res) {
  _btMongodb2.default.statistic.updateStatistic(req.params.id, req.body, function (err, changedStatistic) {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(changedStatistic);
    }
  });
}

function deleteAction(req, res) {
  _btMongodb2.default.statistic.deleteStatistic(req.params.id, function (err, result) {
    if (err) {
      // error logging
      res.send('there was an error, please contact an admin');
    } else {
      res.send(result);
    }
  });
}

exports.default = { getAllAction: getAllAction, getByIdAction: getByIdAction, createAction: createAction, updateAction: updateAction, deleteAction: deleteAction };