import chai from 'chai';
import chaiHttp from 'chai-http';
import mocha from 'mocha';
import app from '../../index';

chai.use(chaiHttp);

const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MDA4MTQzODQsImV4cCI6MTUzMjM1MDM4NCwiYXVkIjoiZXE5THZGdU1lazBENGJTY0lzT2JKSjFiNjFCdUtJQjMiLCJpc3MiOiJodHRwczovL2JyYWludHJhaW5lci5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NTk3NDliN2EwOTBmMDQwNWY4MzNiN2FiIn0.iWp27qQCP-y94UrhqfPV-eKX84A0MJlkNypjY-XkbaA';

mocha.describe('Notecards REST', () => {
  mocha.it('it should GET all notecards', (done) => {
    chai.request(app)
    .get('/api/notecard')
    .set('Authorization', TOKEN)
    .end((err, res) => {
      chai.expect(res).to.have.status(200);
      chai.expect(res.body).to.be.an('array');
      done();
    });
  }).timeout(30000);

/*  mocha.it('it should POST a notecard', (done) => {
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
      console.log(res.body);
      chai.expect(res.body).to.be.a('object');
      chai.expect(res.body).to.have.property('task');
      chai.expect(res.body).to.have.property('answer');
      done();
    });
  }).timeout(30000);

  mocha.it('it should DELETE all notecards', (done) => {
    chai.request(app)
    .get('/api/notecard')
    .set('Authorization', TOKEN)
    .end((err, res) => {
      console.log(res.body);
      chai.expect(res).to.have.status(200);
      /* eslint no-underscore-dangle: 0 */
    /*  const delid = (res.body)[0]._id;
      console.log(delid);
      chai.request(app)
      .del('/api/notecard/', delid)
      .set('Authorization', TOKEN)
      .end((err2, res2) => {
        if (err2) { console.log(err2); }
        chai.expect(res2).to.have.status(200);
        chai.expect(res2.body.property('_id')).to.equal(res.body.property('_id'));
        done();
      });
    });
  }).timeout(30000);*/
});
