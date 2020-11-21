const { TestScheduler } = require('jest');
const request = require ('supertest')
const app = require('../app');

jest.useFakeTimers();

beforeEach(async()=>{
    await request(app).delete('/users')
    .send({
        "userMail": "testfunction@gmail.com"
    })
    console.log('beforeEach')
})
afterEach(()=>{
    console.log('afterEach');    
})

test('Should sign up for a user ', async ()=>{
    await request(app).post('/users')
    .send({
        "email": "testfunction@gmail.com",
        "password": "testpassword"
    })
    .expect(201)
})