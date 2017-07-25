import request from 'request';
import profileController from './controllers/profile.controller';

const conf = require('./config.json');

function startInterval(profile) {
  setInterval(() => {
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
    request(options, (error, response, body) => {
      console.log(body);
    });
  }, profile.interval * 60 * 1000);
}

function startProcess() {
  // All existent profiles
  profileController.getProfiles((err, profiles) => {
    for (let i = 0; i < profiles.length; i += 1) {
      if (profiles[i].firebasetoken && profiles[i].interval) {
        startInterval(profiles[i]);
      }
    }
  });
}

export default { startProcess };
