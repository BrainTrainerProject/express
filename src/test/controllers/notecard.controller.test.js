import chai from 'chai';
import chaiHttp from 'chai-http';
import mocha from 'mocha';
import async from 'async';
import app from '../../index';

chai.use(chaiHttp);

const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MDA4MTQzODQsImV4cCI6MTUzMjM1MDM4NCwiYXVkIjoiZXE5THZGdU1lazBENGJTY0lzT2JKSjFiNjFCdUtJQjMiLCJpc3MiOiJodHRwczovL2JyYWludHJhaW5lci5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NTk3NDliN2EwOTBmMDQwNWY4MzNiN2FiIn0.iWp27qQCP-y94UrhqfPV-eKX84A0MJlkNypjY-XkbaA';

mocha.describe('Notecards REST', () => {
  /*
  READ
  */
  mocha.it('it should GET All notecards', (done) => {
    chai.request(app)
    .get('/api/notecard')
    .set('Authorization', TOKEN)
    .end((err, res) => {
      chai.expect(res).to.have.status(200);
      chai.expect(res.body).to.be.an('array');
      done();
    });
  }).timeout(30000);

  /*
  CREATE
  */
  mocha.it('it should POST a notecard', (done) => {
    const notecard = {
      title: 'Englisch Vokabeln',
      task: 'Was heißt comment?',
      answer: 'Kommentar',
    };
    chai.request(app)
    .post('/api/notecard')
    .set('Authorization', TOKEN)
    .send(notecard)
    .end((err, res) => {
      chai.expect(res).to.have.status(200);
      chai.expect(res.body).to.be.a('object');
      chai.expect(res.body).to.have.property('task');
      chai.expect(res.body).to.have.property('answer');
      done();
    });
  }).timeout(30000);

  /*
  UPDATE
  */
  mocha.it('it should UPDATE a notecard', (done) => {
    async.waterfall([
      (next) => {
        chai.request(app)
        .get('/api/notecard')
        .set('Authorization', TOKEN)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          /* eslint no-underscore-dangle: 0 */
          const updid = (res.body)[0]._id;
          const updurl = `/api/notecard/${updid}`;
          next(null, updurl);
        });
      },
      (updurl, next) => {
        const notecard = {
          title: 'Englisch Vokabeln Update',
          task: 'Was heißt comment?',
          answer: 'Kommentar',
        };
        chai.request(app)
        .put(updurl)
        .set('Authorization', TOKEN)
        .send(notecard)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect((res.body).title).to.equal(notecard.title);
          next(null);
        });
      },
    ], done);
  }).timeout(30000);

  /*
  DELETE
  */
  mocha.it('it should DELETE a notecard', (done) => {
    async.waterfall([
      (next) => {
        chai.request(app)
        .get('/api/notecard')
        .set('Authorization', TOKEN)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          /* eslint no-underscore-dangle: 0 */
          const delid = (res.body)[0]._id;
          const delurl = `/api/notecard/${delid}`;
          next(null, delurl, delid);
        });
      },
      (delurl, delid, next) => {
        chai.request(app)
        .del(delurl)
        .set('Authorization', TOKEN)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          /* eslint no-underscore-dangle: 0 */
          chai.expect((res.body)._id).to.equal(delid);
          next(null);
        });
      },
    ], done);
  }).timeout(30000);
});
