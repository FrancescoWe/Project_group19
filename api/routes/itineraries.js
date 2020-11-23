// Route di "itineraries"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const MeteoComponent = require('../models/meteoComponent');
const Itinerary = require('../models/itinerary');
const User = require('../models/user');

// Connessione al DB
const db = mongoose.connection;


// Definizione del metodo GET: ricerca gli itinerari di tutti gli user
router.get('/', async(req,res) => {
    try{
        let founduser = await User.findById(req.body.user_id);
        if(founduser != undefined)
            res.status(200).json(founduser.itinerary);
        else
            res.status(400).send("User with id: "+req.body.user_id+" not found");
    } catch(err){
        res.status(400).send(err);
    }
});

/* Definizione del metodo POST: crea un itinerario vuoto e lo salva,
connettendolo ad un utente singolo (specifica l'id dell' utente nel body della post) */
router.post('', async (req, res) => {

    try{
        let userfound = await User.findOne({_id: req.body.user_id});
        //console.log("User with id: "+req.body.user_id+" found");

        let newitinerary = new Itinerary();

        await User.updateOne(
            {_id: userfound},
            {$push : {itinerary: newitinerary}}
        );

        //console.log('Itinerary saved and binded successfully to user '+userfound._id);
        res.status(201).send('Itinerary saved and binded successfully to user '+userfound._id);
    }catch{
        res.status(400).send("User with id: "+ req.body.id +" not found");
        console.log("User with id: "+req.body.id+" not found");
    }

});

/* Definizione del metodo DELETE: elimina un determinato itinerario dal DB e dalla lista degli itinerari dell'utente che lo aveva.
Richiede un oggetto JSON nel body della richiesta con il campo "id" dell'itinerario che si intende eliminare*/
router.delete('', async (req,res)=> {

    try{
        var usertomodify = await User.findById(req.body.user_id);
        var itinerarytomodify;
        var count=-1;

        var infolenIT = Object.keys(usertomodify.itinerary).length;

        for(let i=0;i<infolenIT;i++){
            if(usertomodify.itinerary[i].id == req.body.itinerary_id){
                itinerarytomodify = usertomodify.itinerary[i];
                count=i;
                infolenIT=-1;
            }
        }

        if(count!=-1){
            await User.updateOne(
                { _id: req.body.user_id},
                { $pull:  {itinerary : itinerarytomodify} }
            ); 
            res.status(201).send("Itinerary "+req.body.itinerary_id+" deleted\nUser "+usertomodify.id+" updated.\n");
        } else {
            res.status(400).send("Itinerary "+req.body.itinerary_id+" not found.\n");

        } 
    }catch(err){
        res.status(400).send("Itinerary "+req.body.itinerary_id+" not found.\n");
    }

});

/*
router.delete('', async (req,res)=> {

    try{
        let removedItinerary = await Itinerary.deleteOne({_id: req.body.itId});
        res.send("Itinerary with id "+req.body.itId+" successfully deleted.");
        console.log("Itinerary with id "+req.body.itId+" successfully deleted.");
    }catch(err){
        res.send("Itinerary with id "+req.body.itId+" not found.");
        console.log("Itinerary with id "+req.body.itId+" not found.");
    }

});
*/


/*
router.delete('/', async (req,res)=> {

    try{
        const removeditinerary = await Itinerary.deleteOne({_id: req.body.itineraryId})
        res.json(removeditinerary);
    }catch(err){
        res.json({message: err});
    }

})
*/

module.exports = router;