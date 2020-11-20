// Route di "itineraries"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MeteoComponent = require('../models/meteoComponent');
const Itinerary = require('../models/itinerary');
const User = require('../models/user');

// Connessione al DB
const db = mongoose.connection;


// Definizione del metodo GET: ricerca gli itinerari di tutti gli user
router.get('/', async(req,res,next) => {
    let itineraries = await Itinerary.find({}).exec();
    itineraries = itineraries.map( (itinerary) => {
        return {
            id: itinerary.id,
            user_id : itinerary.user_id
        };
    });
    res.status(200).json(itineraries);
});

/* Definizione del metodo POST: crea un itinerario vuoto e lo salva,
connettendolo ad un utente singolo (specifica l'id dell' utente nel body della post) */
router.post('', async (req, res) => {

    try{
        const userfound = await User.findOne({_id: req.body.id});
        console.log("User with id: "+req.body.id+" found");

        let newitinerary = new Itinerary({
            user_id : req.body.id,
        });

        newitinerary = await newitinerary.save();

        await User.updateOne(
            {_id: userfound},
            {$push : {itinerary: newitinerary._id}}
        );

        console.log('Itinerary saved and binded successfully to user '+userfound._id);
        res.send("Inviato e collegato all'utente: "+userfound._id+" correttamente");
    }catch{
        res.send("User with id: "+ req.body.id +" not found");
        console.log("User with id: "+req.body.id+" not found");
    }

});

/* Definizione del metodo DELETE: elimina un determinato itinerario dal DB e dalla lista degli itinerari dell'utente che lo aveva.
Richiede un oggetto JSON nel body della richiesta con il campo "id" dell'itinerario che si intende eliminare*/
router.delete('/', async (req,res)=> {

    try{

        let removedItinerary = await User.findOne({_id: req.body.id});
        let itineraryUser = removedItinerary.user_id;
      
        res.json(removedItinerary);

        for(i=0; i<=remove; i++){
            
        }


        await Itinerary.deleteOne({_id: req.params.itId})
    }catch(err){
        res.json({message: err});
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