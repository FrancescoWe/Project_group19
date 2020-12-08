const { TestScheduler } = require('jest');
const request = require ('supertest')
const app = require('../app');

jest.useFakeTimers();

beforeEach(async()=>{
    console.log('beforeEach')
})
afterEach(()=>{
    console.log('afterEach');
})

// Test relativi agli itinerary per Jest

test('Restituisce gli itinerari di un determinato User ', async ()=>{
    await request(app).get('/itineraries/5fccf1aa56821144446c430a')
    .expect(201)
}, 30000)

test('Dà errore perchè non esiste uno user con tale id', async()=>{
    await request(app).get('/itineraries/asdpojhnodfafrwqeirbuocb')
    .expect(400)
}, 30000)
/*
test('Crea un itinerario e lo inserisce in un determinato user', async ()=>{
    await request(app).post('/itineraries')
    .send({
        "user_id": "5fc3c55abfcb0338d4e76sos"
    })
    .expect(201)
}, 30000)
*/
test('Ritorna un errore poichè mancano dei campi nel body', async ()=>{
    await request(app).get('/itineraries')
    .expect(404)
}, 30000)

test('Ritorna errore perchè i campi passati non sono in formato corretto', async()=>{
    await request(app).get('/itineraries/125551')
    .expect(400)
})