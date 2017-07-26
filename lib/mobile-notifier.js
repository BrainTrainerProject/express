'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _profile = require('./controllers/profile.controller');

var _profile2 = _interopRequireDefault(_profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conf = require('./config.json');

var users = [];

function removeProfile(id) {
  for (var i = 0; i < users.length; i += 1) {
    if (users.profile.id === id) {
      clearInterval(users[i].iid);
      users.splice(i, 1);
      break;
    }
  }
}

function startInterval(profile) {
  var iid = setInterval(function () {
    var bodyData = {
      to: profile.firebasetoken,
      data: {
        ueben: 'true'
      },
      notification: {
        title: 'Es ist Zeit zu ueben',
        body: 'justDoIt!'
      }
    };

    var options = {
      url: conf.firebase_url,
      method: 'POST',
      headers: {
        Authorization: conf.firebase_key
      },
      json: true,
      body: bodyData
    };
    // callback param (error, response, body)
    (0, _request2.default)(options, function (error) {
      if (error) {
        removeProfile(profile.id);
      }
    });
  }, profile.interval * 60 * 1000);

  return iid;
}

function addProfile(profile) {
  var iid = startInterval(profile);
  users.push({ profile: profile, iid: iid });
}

function startProcess() {
  // All existent profiles
  _profile2.default.getProfiles(function (err, profiles) {
    for (var i = 0; i < profiles.length; i += 1) {
      if (profiles[i].firebasetoken && profiles[i].interval) {
        addProfile(profiles[i]);
      }
    }
  });
}

exports.default = {
  startProcess: startProcess,
  addProfile: addProfile,
  removeProfile: removeProfile
};