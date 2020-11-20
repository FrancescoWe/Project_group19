// Route di "meteoComponents"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MeteoComponent = require('../models/meteoComponent');
const Itinerary = require('../models/itinerary');

// Connessione al DB
const db = mongoose.connection;

// Definizione del metodo GET: ricerca i meteoComponents di tutti gli user
router.get('/', async(req,res,next) => {
    let meteoComponents = await MeteoComponent.find({}).exec();
    meteoComponents = meteoComponents.map( (meteoComponent) => {
        return {
            self: '/api/v1/meteoComponents/' + meteoComponent.id,
            temp_Max: meteoComponent.temp_Max,
            temp_Min: meteoComponent.temp_Min,
            date: meteoComponent.date,
            cityName: meteoComponent.cityName
        };
    });
    res.status(200).json(meteoComponents);
});

/* Definizione del metodo GET con path "/:id": ricerca di un componente meteo tramite id.
Utile per avere informazioni su un meteoComponent dopo averne ottenuto l'ID da un itinerario di un utente*/
router.get('/:id', async (req, res) => {
    let meteoComponent = await MeteoComponent.findById(req.params.id).exec();
    res.status(200).json({
        self: '/api/v1/meteoComponents/' + meteoComponent.id,
        temp_Max: meteoComponent.temp_Max,
        temp_Min: meteoComponent.temp_Min,
        date: meteoComponent.date,
        cityName: meteoComponent.cityName
    });
});

//Definizione del metodo POST: crea un meteoComponent e lo salva nel DB
router.post('', async (req, res) => {

    try{
        const itineraryid = await Itinerary.findById(req.body.id);
        console.log("Itinerary with id:"+req.body.id+" found");

        let meteoComponent = new MeteoComponent({
            temp_Max: req.body.temp_Max,
            temp_Min: req.body.temp_Min,
            date: req.body.date,
            cityName: req.body.cityName
        });
            
        meteoComponent = await meteoComponent.save();
            
        await Itinerary.updateOne(
            {_id: itineraryid},
            {$push : {meteos_dates: meteoComponent._id}}
        );

        const itineraryuser = await Itinerary.findById(itineraryid);
        console.log("Meteo data binded to itinerary "+req.body.id);
        res.send("I dati del meteo con l' id: "+meteoComponent._id+"\nsono stati aggiunti all' itinerario con id: "+req.body.id+"\ncollegato all' utente con id: "+itineraryuser.user_id+"\n");

    }catch(err){
        console.log("Itinerary with id:"+req.body.id+" not found");
        res.send("Itinerary with id:"+req.body.id+" not found");
    }

});


module.exports = router;