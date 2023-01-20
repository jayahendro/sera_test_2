const { expect } = require('chai');
const chai = require('chai');
const request = require('supertest');

const app = require('../server');

chai.should();

describe('Test GET /users', () => {
  it('should respond with 200 success', async () => {
    await request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200);
    });
});

describe('Test GET /users/:userId', () => {
  it('should respond with 200 success', async () => {
    const response = await request(app)
      .get('/users/1')
      .expect('Content-Type', /json/)
      .expect(200);

      response.body.should.have.valueOf({
        id: 1,
        name: 'Jaya Hendro Gunawan',
        email: 'jaya.hendra05@gmail.com'
      });
    });
  it('should respond with 200 success', async () => {
    const response = await request(app)
      .get('/users/99')
      .expect('Content-Type', /json/)
      .expect(404);

      response.body.should.have.valueOf({
        error: 'User not found'
    });
    });
});

describe('Test POST /users', () => {
  it('should respond with 201 success', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Test',
        email: 'testing@gmail.com'
      })
      .expect('Content-Type', /json/)
      .expect(201);
  });
  it('should return error because missing name', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'testing@gmail.com'
      })
      .expect('Content-Type', /json/)
      .expect(400);

      response.body.should.have.valueOf({
        error: 'Missing user name'
      });
  });
  it('should return error because missing email', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Test',
      })
      .expect('Content-Type', /json/)
      .expect(400);

      response.body.should.have.valueOf({
        error: 'Missing user email'
      });
  });
  it('should return error because user already existed', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Jaya Hendro Gunawan',
        email: 'jaya.hendra05@gmail.com'
      })
      .expect('Content-Type', /json/)
      .expect(409);

      response.body.should.have.valueOf({
        error: 'User email already existed'
      });
  });
});

describe('Test PUT /users', () => {
  it('should respond with 200 success', async () => {
    await request(app)
      .put('/users/1')
      .send({
        name: 'Test',
        email: 'testing@gmail.com'
      })
      .expect('Content-Type', /json/)
      .expect(200);
  });
  it('should return error because user not found', async () => {
    const response = await request(app)
      .put('/users/99')
      .send({
        name: 'Test',
        email: 'testing@gmail.com'
      })
      .expect('Content-Type', /json/)
      .expect(404);

      response.body.should.have.valueOf({
        error: 'User not found'
      });
  });
});

describe('Test DELETE /users', () => {
  it('should respond with 200 success', async () => {
    await request(app)
      .delete('/users/1')
      .expect('Content-Type', /json/)
      .expect(200);
  });
  it('should return error because user not found', async () => {
    const response = await request(app)
      .delete('/users/99')
      .expect('Content-Type', /json/)
      .expect(404);

      response.body.should.have.valueOf({
        error: 'User not found'
      });
  });
});