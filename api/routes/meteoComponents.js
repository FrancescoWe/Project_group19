// Route di "meteoComponents"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../models/user");
const MeteoComponent = require("../models/meteoComponent");

// Connessione al DB
const db = mongoose.connection;

// Definizione del metodo GET: ricerca i meteoComponents di tutti gli user
router.get('/', async(req,res) => {
    try{
        
        let founditinerary = await User.findOne(
            {"_id": req.body.user_id},
            { "itinerary" : {$elemMatch : {"_id" : req.body.itinerary_id}}}
        );

        res.status(201).send(founditinerary.itinerary[0].meteos_dates);

    } catch(err){
        res.status(400).send("Si è verificato un errore.");
    }
});

//Definizione del metodo POST: crea un meteoComponent e lo salva nel DB
router.post('', async (req, res) => {

    try{
        let meteoComponents = new MeteoComponent({
            temp_Max : req.body.temp_Max,
            temp_Min : req.body.temp_Min,
            date : req.body.date,
            cityName : req.body.cityName
        });

        await User.updateOne(
            {"_id": req.body.user_id, "itinerary._id" : req.body.itinerary_id},
            {"$push" : { "itinerary.$.meteos_dates" : meteoComponents } },
        );

        res.status(201).send("Meteo data added to itinerary: "+req.body.itinerary_id+"\nBinded to user: "+req.body.user_id+"\n");
    
    }catch(err){
        res.status(400).send("Itinerary with id:"+req.body.itinerary_id+" not found");
    }

});


router.delete('', async (req,res)=> {

    try{
        await User.updateOne(
            {"_id": req.body.user_id, "itinerary._id" : req.body.itinerary_id},
            {"$pull" : { "itinerary.$.meteos_dates" : {"_id" : req.body.meteo_id} } }
        );

        res.status(201).send("MeteoComponent "+req.body.meteo_id+" deleted\nItinerary "+req.body.itinerary_id+" updated.\n");
    
    }catch(err){
        res.status(400).send("Meteocomponent "+req.body.meteo_id+" not found.\n");
    }

});


module.exports = router;