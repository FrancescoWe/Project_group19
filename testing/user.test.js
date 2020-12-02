const { TestScheduler } = require('jest');
const request = require ('supertest')
const app = require('../app');

jest.useFakeTimers();

beforeEach(async()=>{
    await request(app).delete('/users/testfunction@gmail.com')
    .send({
        "userMail": "testfunction@gmail.com"
    })
    await request(app).delete('/users/pinodaniele')
    .send({
        "userMail": "pinodaniele"
    })
    await request(app).post('/users')
    .send({
        "email":"delete@gmail.com",
        "password":"password"
    })
    console.log('beforeEach')
})
afterEach(()=>{
    console.log('afterEach');
})

// Test relativi agli user per Jest

test('Registra un utente con email "testfunction@gmail.com" e password "testpassword". ', async ()=>{
    await request(app).post('/users')
    .send({
        "email": "testfunction@gmail.com",
        "password": "testpassword"
    })
    .expect(201)
})


test('Restituisce un errore in quanto la mail non ha il formato corretto. ', async ()=>{
    await request(app).post('/users')
    .send({
        "email": "pinodaniele",
        "password": "testpassword"
    })
    .expect(400)
})


test('Restituisce un errore in quanto la password è vuota. ', async ()=>{
    await request(app).post('/users')
    .send({
        "email": "testfunction@gmail.com",
        "password":""
    })
    .expect(400)
})


test('Esiste un utente nel database.', async ()=>{
    await request(app).get('/users')
    .send({
    })
    .expect(201)
})

test('Permette all utente con email "user@domain.com" e password "abracadabra" di effettuare il login (user predefinito). ', async ()=>{
    await request(app).get('/users')
    .send({
        "email": "user@domain.com",
        "password": "abracadabra"
    })
    .expect(201)
})

test('Cancella un utente dal database.', async ()=>{
    await request(app).delete('/users/delete@gmail.com')
    .expect(201)    // in questo caso 200 perchè non è un 201 created ma 200 OK
})