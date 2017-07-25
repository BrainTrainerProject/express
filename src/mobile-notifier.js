import request from 'request';
import profileController from './controllers/profile.controller';

const conf = require('./config.json');

const users = [];

function removeProfile(id) {
  for (let i = 0; i < users.length; i += 1) {
    if (users.profile.id === id) {
      clearInterval(users[i].iid);
      users.splice(i, 1);
      break;
    }
  }
}

function startInterval(profile) {
  const iid = setInterval(() => {
    const bodyData = {
      to: profile.firebasetoken,
      data: {
        ueben: 'true',
      },
      notification: {
        title: 'Es ist Zeit zu ueben',
        body: 'justDoIt!',
      },
    };

    const options = {
      url: conf.firebase_url,
      method: 'POST',
      headers: {
        Authorization: conf.firebase_key,
      },
      json: true,
      body: bodyData,
    };
    // callback param (error, response, body)
    request(options, (error) => {
      if (error) {
        removeProfile(profile.id);
      }
    });
  }, profile.interval * 60 * 1000);

  return iid;
}

function addProfile(profile) {
  const iid = startInterval(profile);
  users.push({ profile, iid });
}

function startProcess() {
  // All existent profiles
  profileController.getProfiles((err, profiles) => {
    for (let i = 0; i < profiles.length; i += 1) {
      if (profiles[i].firebasetoken && profiles[i].interval) {
        addProfile(profiles[i]);
      }
    }
  });
}

export default {
  startProcess,
  addProfile,
  removeProfile,
};
