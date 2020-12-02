const { TestScheduler } = require('jest');
const request = require ('supertest')
const app = require('../app');
jest.useFakeTimers();


beforeEach(async()=>{

})
afterEach(()=>{
})

test('Ritorna tutti i meteoComponents facenti parte di un determinato itinerario di un determinato user', async ()=>{
    await request(app).get('/meteoComponents')
    .send({
        "user_id": "5fc3c55abfcb0338d4e76eeb",
        "itinerary_id": "5fc80233ef17af1a0467779d"
    })
    .expect(201)
})

test('Crea un meteoComponent e lo inserisce nell itinerario indicato di un determinato user', async ()=>{
    await request(app).post('/meteoComponents')
    .send({
        "id": "adsifjbhoipsadgvasdf",
        "user_id": "5fc3c55abfcb0338d4e76eeb",
        "itinerary_id": "5fc80233ef17af1a0467779d",
        "temp_Max": "17°",
        "temp_Min": "-10°",
        "date": "18/05/2011",
        "cityName": "Trento TN"
    })
    .expect(201)
})




