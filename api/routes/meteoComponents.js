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
        let founduser = await User.findById(req.body.user_id);
        let founditinerary;

        let infolenIT = Object.keys(founduser.itinerary).length;

        for(let i=0;i<infolenIT;i++){
            if(founduser.itinerary[i].id == req.body.itinerary_id){
                founditinerary = founduser.itinerary[i];
                infolenIT=-1;
            }
        }

        let meteoComponents = founditinerary.meteos_dates;
        res.status(201).send(meteoComponents);
    } catch(err){
        res.status(400).send("Si è verificato un errore.");
    }
});

/* Definizione del metodo GET con path "/:id": ricerca di un componente meteo tramite id.
Utile per avere informazioni su un meteoComponent dopo averne ottenuto l'ID da un itinerario di un utente*/
router.get('/:id', async (req, res) => {
    try {
        let meteoComponent = await MeteoComponent.findById(req.params.id).exec();
        res.status(201).json({
            self: '/api/v1/meteoComponents/' + meteoComponent.id,
            temp_Max: meteoComponent.temp_Max,
            temp_Min: meteoComponent.temp_Min,
            date: meteoComponent.date,
            cityName: meteoComponent.cityName
        });
    } catch(err){
        res.status(400).send("La meteoComponent con id: " + req.params.id + " non esiste.");
    }
});

//Definizione del metodo POST: crea un meteoComponent e lo salva nel DB
router.post('', async (req, res) => {

    try{
        let founduser = await User.findById(req.body.user_id);
        //console.log("Itinerary with id:"+req.body.id+" found");

        let founditinerary;
        var count=-1;

        let infolenIT = Object.keys(founduser.itinerary).length;

        for(let i=0;i<infolenIT;i++){
            if(founduser.itinerary[i].id == req.body.itinerary_id){
                founditinerary = founduser.itinerary[i];
                infolenIT=-1;
                count=i;
            }
        }

        let meteoComponents = new MeteoComponent({
            temp_Max : req.body.temp_Max,
            temp_Min : req.body.temp_Min,
            date : req.body.date,
            cityName : req.body.cityName
        });

        if(count!=-1){
            await User.updateOne(
                {"_id": req.body.user_id, "itinerary._id" : req.body.itinerary_id},
                {"$push" : { "itinerary.$.meteos_dates" : meteoComponents } },
            );
            console.log("Meteo data binded to itinerary "+req.body.itinerary_id);
            res.status(201).send("I dati del meteo sono stati aggiunti all' itinerario con id: "+req.body.itinerary_id+"\ncollegato all' utente con id: "+req.body.user_id+"\n");    
        } else
            res.status(400).send("Itinerary with id:"+req.body.itinerary_id+" not found");
    }catch(err){
        console.log("Itinerary with id:"+req.body.itinerary_id+" not found");
        res.status(400).send("Itinerary with id:"+req.body.itinerary_id+" not found");
    }

});


router.delete('', async (req,res)=> {

    //console.log("Id ottenuto : "+req.body.id);

    try{

        let founduser = await User.findById(req.body.user_id);
        //console.log("Itinerary with id:"+req.body.id+" found");

        let founditinerary;
        let foundmeteocomponent;
        var count1=-1;
        var count2=-1;

        let infolenIT = Object.keys(founduser.itinerary).length;

        for(let i=0;i<infolenIT;i++){
            if(founduser.itinerary[i].id == req.body.itinerary_id){
                founditinerary = founduser.itinerary[i];
                infolenIT=-1;
                count1=i;
            }
        }

        let infolenMETEO = Object.keys(founditinerary.meteos_dates).length;

        for(let i=0;i<infolenMETEO;i++){
            if(founditinerary.meteos_dates[i].id == req.body.meteo_id){
                foundmeteocomponent = founditinerary.meteos_dates[i];
                infolenMETEO=-1;
                count2=i;
            }
        }

        if(count2!=-1){
            await User.updateOne(
                {"_id": req.body.user_id, "itinerary._id" : req.body.itinerary_id},
                {"$pull" : { "itinerary.$.meteos_dates" : foundmeteocomponent } }
            );
            res.status(201).send("MeteoComponent "+req.body.meteo_id+" deleted\nItinerary "+req.body.itinerary_id+" updated.\n");
        } else
            res.status(400).send("Meteocomponent "+req.body.meteo_id+" not found.\n");
    }catch(err){
        res.status(400).send("Meteocomponent "+req.body.meteo_id+" not found.\n");
    }

});


module.exports = router;