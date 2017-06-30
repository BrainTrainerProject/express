import { describe, it, before } from 'mocha';
import jsonwebtoken from 'jsonwebtoken';
import dbmodel from 'bt-mongodb';
import apiauthorization from '../../middleware/apiauthorization';
import errorcodes from './../../middleware/errorJsons';

const assert = require('chai').assert;
const config = require('./../../config.json');

function buildJWT(aud, iss, sub, exp) {
  return jsonwebtoken.sign({},
      config.auth0.clientSecret,
    { audience: aud,
      issuer: iss,
      subject: sub,
      expiresIn: exp });
}

before((done) => {
  dbmodel.connect(config.mongodb, (err) => {
    done(err);
  });
});

describe('apiauthorization', () => {
  describe('extractTokenFromHeader', () => {
    it('should call callback with error json', (done) => {
      apiauthorization.extractTokenFromHeader({}, (error, token) => {
        assert.deepEqual(error, errorcodes.wrongAuthHeader());
        assert.isNull(token);
        done();
      });
    });

    it('should call callback with error json 2', (done) => {
      apiauthorization.extractTokenFromHeader({ authorization: 'Something else' }, (error, token) => {
        assert.deepEqual(error, errorcodes.wrongAuthHeader());
        assert.isNull(token);
        done();
      });
    });

    it('should call callback with error json 3', (done) => {
      apiauthorization.extractTokenFromHeader({ authorization: 'Bearer' }, (error, token) => {
        assert.deepEqual(error, errorcodes.undefinedToken());
        assert.isNull(token);
        done();
      });
    });

    it('should get token from authorization header', (done) => {
      apiauthorization.extractTokenFromHeader({ authorization: 'Bearer token' }, (error, token) => {
        assert.isNull(error);
        assert.equal(token, 'token');
        done();
      });
    });
  });

  describe('getProfile', () => {
    it('should call callback with the correct profile', (done) => {
      const jwt = buildJWT(config.auth0.clientId,
          `https://${config.auth0.domain}/`,
          'auth0|987654321',
          60 * 60 * 24 * 365);
      const expected = { email: 'testuser',
        oauthtoken: 'auth0|987654321',
        photourl: 'someurl',
        visibility: false,
        interval: 30,
        cardsPerSession: 15,
        sets: [],
        follower: [] };
      dbmodel.profile.createProfile(expected, (err, newProfile) => {
        if (!err && newProfile) {
          apiauthorization.getProfile(jwt, (err1, profile) => {
            if (!err1 && profile) {
              assert.equal(profile.email, expected.email);
              assert.equal(profile.oauthtoken, expected.oauthtoken);
              assert.equal(profile.photourl, expected.photourl);
              assert.equal(profile.visibility, expected.visibility);
              assert.equal(profile.interval, expected.interval);
              assert.equal(profile.cardsPerSession, expected.cardsPerSession);
              assert.isArray(profile.sets);
              assert.equal(profile.sets.length, 0);
              assert.isArray(profile.follower);
              assert.equal(profile.follower.length, 0);
              dbmodel.profile.deleteProfile(profile.id, (err2, result) => {
                if (!err2 && result) {
                  done();
                }
              });
            }
          });
        }
      });
    });

    it('should call callback with null', (done) => {
      const jwt = buildJWT(config.auth0.clientId,
              `https://${config.auth0.domain}/`,
              'auth0|987654321',
              60 * 60 * 24 * 365);
      apiauthorization.getProfile(jwt, (err, profile) => {
        assert.isNull(profile);
        done();
      });
    });

    it('should call callback with null 2', (done) => {
      const jwt = buildJWT(config.auth0.clientId,
              `https://${config.auth0.domain}/`,
              'something else',
              60 * 60 * 24 * 365);
      apiauthorization.getProfile(jwt, (err, profile) => {
        assert.isNull(profile);
        done();
      });
    });

    it('should call callback with error json', (done) => {
      const jwt = buildJWT('something else',
            `https://${config.auth0.domain}/`,
            'auth0|987654321',
            60 * 60 * 24 * 365);
      apiauthorization.getProfile(jwt, (err, profile) => {
        assert.deepEqual(err, errorcodes.jwtNotValid());
        assert.isNull(profile);
        done();
      });
    });

    it('should call callback with error json 2', (done) => {
      const jwt = buildJWT(config.auth0.clientId,
            'something else',
            'auth0|987654321',
            60 * 60 * 24 * 365);
      apiauthorization.getProfile(jwt, (err, profile) => {
        assert.deepEqual(err, errorcodes.jwtNotValid());
        assert.isNull(profile);
        done();
      });
    });


    it('should call callback with error json 3', (done) => {
      const jwt = buildJWT(config.auth0.clientId,
            `https://${config.auth0.domain}/`,
            'auth0|987654321',
            -1);
      apiauthorization.getProfile(jwt, (err, profile) => {
        assert.deepEqual(err, errorcodes.jwtNotValid());
        assert.isNull(profile);
        done();
      });
    });

    it('should call callback with error json 4', (done) => {
      apiauthorization.getProfile(undefined, (err, profile) => {
        assert.deepEqual(err, errorcodes.jwtNotValid());
        assert.isNull(profile);
        done();
      });
    });
  });

  describe('apiAuth', () => {
    it('should set correct profile in req.auth0', (done) => {
      const jwt = buildJWT(config.auth0.clientId,
            `https://${config.auth0.domain}/`,
            'auth0|987654321',
            60 * 60 * 24 * 365);
      const expected = { email: 'testuser',
        oauthtoken: 'auth0|987654321',
        photourl: 'someurl',
        visibility: false,
        interval: 30,
        cardsPerSession: 15,
        sets: [],
        follower: [] };
      dbmodel.profile.createProfile(expected, (err, profile) => {
        if (!err && profile) {
          const req = { headers:
          { authorization: `Bearer ${jwt}`,
          } };
          apiauthorization.apiAuth(req, {}, () => {
            assert.equal(req.auth0.email, expected.email);
            assert.equal(req.auth0.oauthtoken, expected.oauthtoken);
            assert.equal(req.auth0.photourl, expected.photourl);
            assert.equal(req.auth0.visibility, expected.visibility);
            assert.equal(req.auth0.interval, expected.interval);
            assert.equal(req.auth0.cardsPerSession, expected.cardsPerSession);
            assert.isArray(req.auth0.sets);
            assert.equal(req.auth0.sets.length, 0);
            assert.isArray(req.auth0.follower);
            assert.equal(req.auth0.follower.length, 0);
            dbmodel.profile.deleteProfile(profile.id, (err1, result) => {
              if (!err1 && result) {
                done();
              }
            });
          });
        }
      });
    });

    it('should call send from res with error json', (done) => {
      const jwt = buildJWT(config.auth0.clientId,
            `https://${config.auth0.domain}/`,
            'auth0|987654321',
            60 * 60 * 24 * 365);
      const req = { headers:
      { authorization: `Bearer ${jwt}`,
      } };
      const res = { send: (error) => {
        assert.deepEqual(error, errorcodes.noMatchingProfile());
        done();
      } };
      apiauthorization.apiAuth(req, res, undefined);
    });

    it('should call send from res with error json 2', (done) => {
      const req = { headers:
      { authorization: 'Bearer token',
      } };
      const res = { send: (error) => {
        assert.deepEqual(error, errorcodes.jwtNotValid());
        done();
      } };
      apiauthorization.apiAuth(req, res, undefined);
    });

    it('should call send from res with error json 3', (done) => {
      const req = { headers: {} };
      const res = { send: (error) => {
        assert.deepEqual(error, errorcodes.wrongAuthHeader());
        done();
      } };
      apiauthorization.apiAuth(req, res, undefined);
    });
  });
});
