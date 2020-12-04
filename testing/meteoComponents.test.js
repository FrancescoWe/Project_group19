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
}, 30000)

test('Dà errore perchè non esiste uno user con tale id nè un itinerario con tale id', async()=>{
    await request(app).get('/meteoComponents')
    .send({
        "user_id": "asdpojhnodfafrwqeirbuocbpodwaur8hgolsadfncjlbno",
        "itinerary_id": "apodfiuhjapouigvhniph9owaefdsvc"
    })
    .expect(400)
})

/*test('Crea un meteoComponent e lo inserisce nell itinerario indicato di un determinato user', async ()=>{
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
})*/

test('Ritorna un errore poichè mancano dei campi nel body', async ()=>{
    await request(app).get('/meteoComponents')
    .send({
        "user_id": "5fc3c55abfcb0338d4e76eeb",
    })
    .expect(400)
}, 30000)

test('Ritorna errore perchè i campi passati non sono in formato corretto', async()=>{
    await request(app).get('/meteoComponents')
    .send({
        "user_id": 125551,
        "itinerary_id": 23.5
    })
    .expect(400)
})




