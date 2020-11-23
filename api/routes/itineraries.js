// Route di "itineraries"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const Itinerary = require('../models/itinerary');
const User = require('../models/user');

// Connessione al DB
const db = mongoose.connection;


// Definizione del metodo GET: ricerca gli itinerari di tutti gli user
router.get('/', async(req,res) => {
    try{

        let founduser = await User.findById(req.body.user_id);
        res.status(200).json(founduser.itinerary);

    } catch(err){
        res.status(400).send("User with id: "+req.body.user_id+" not found");
    }
});

/* Definizione del metodo POST: crea un itinerario vuoto e lo salva,
connettendolo ad un utente singolo (specifica l'id dell' utente nel body della post) */
router.post('/', async (req, res) => {

    try{
        let userfound = await User.findOne({_id: req.body.user_id});

        let newitinerary = new Itinerary();

        await User.updateOne(
            {"_id" : userfound._id},
            {"$push" : {"itinerary" : newitinerary}}
        );

        res.status(201).send('Itinerary saved and binded successfully to user '+req.body.user_id);
    }catch{
        res.status(400).send("User with id: "+ req.body.user_id +" not found");
    }

});

/* Definizione del metodo DELETE: elimina un determinato itinerario dal DB e dalla lista degli itinerari dell'utente che lo aveva.
Richiede un oggetto JSON nel body della richiesta con il campo "id" dell'itinerario che si intende eliminare*/
router.delete('/', async (req,res)=> {

    try{

        await User.updateOne(
            { "_id": req.body.user_id},
            { "$pull" :  {"itinerary" : {"_id" : req.body.itinerary_id} } }
        );
        
        res.status(201).send("Itinerary "+req.body.itinerary_id+" deleted\nUser "+req.body.user_id+" updated.\n");
    }catch(err){
        res.status(400).send("Itinerary "+req.body.itinerary_id+" not found.\n");
    }

});

module.exports = router;