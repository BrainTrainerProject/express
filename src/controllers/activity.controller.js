import dbmodel from 'bt-mongodb';
import websocket from '../websocket';

function pageActivityAction(req, res) {
  // dbmodel.tuwastolles
  res.send('Not yer implemented');
}

function createActivityForFollower(creator, type) {
  for (let i = 0; i < creator.follower.length; i += 1) {
    const jso = {
      owner: creator.follower[i],
      sender: creator.id,
      activityType: type,
    };
    dbmodel.activity.createActivity(jso, (err, newActivity) => {
      if (err) {
        console.log(err);
      } else {
        websocket.notify(creator, newActivity);
      }
    });
  }
}

export default {
  pageActivityAction,
  createActivityForFollower,
};
