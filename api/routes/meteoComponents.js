// Route di "meteoComponents"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../models/user");
const MeteoComponent = require("../models/meteoComponent");

// Connessione al DB
const db = mongoose.connection;

/* Definizione del metodo GET: ricerca i meteoComponents dell'itinerario specificato, appartenente all'utente specificato.
Richiede un oggetto JSON nel body della richiesta con i campi:
- user_id: l'ID dell'utente di cui si vogliono avere le informazioni
- itinerary_id: l'ID dell'itinerario di cui si vogliono avere le meteoComponents.*/
router.get('/', async(req,res) => {
    try{
        
        let founditinerary = await User.findOne(                                // Ricerca dell'utente corrispondente all'id specificato
            {"_id": req.body.user_id},
            { "itinerary" : {$elemMatch : {"_id" : req.body.itinerary_id}}}     // Ricerca dell'itinerary specificato
        );                                                                                

        res.status(201).send(founditinerary.itinerary[0].meteos_dates);         // Restituzione della lista delle meteos_dates di tale itinerario

    } catch(err){
        res.status(400).send("Si è verificato un errore.");                     // Caso in cui si è verificato un errore
    }
});

/* Definizione del metodo POST: crea un meteoComponent che verrà aggiunto all'itinerario specificato, il quale appartiene all'utente specificato.
Richiede un oggetto JSON nel body della richiesta con i campi:
- user_id: l'ID dell'utente a cui appartiene l'itinerario da modificare
- itinerary_id: l'ID dell'itinerario da modificare appartenente a tale utente
- temp_Max: la temeratura massima del nuovo meteoComponent
- temp_Mix: la temeratura minima del nuovo meteoComponent
- date: la data corrispondente al nuovo meteoComponent
- cityName: la città corrispondente al nuovo meteoComponent.*/
router.post('', async (req, res) => {

    try{
        let meteoComponents = new MeteoComponent({      // Creazione del nuovo meteoComponent
            temp_Max : req.body.temp_Max,
            temp_Min : req.body.temp_Min,
            date : req.body.date,
            cityName : req.body.cityName
        });

        await User.updateOne(              // Aggiornamento della lista di itinerari dell'utente specificato tramite l'aggiunta il meteoComponent appena creato
            {"_id": req.body.user_id, "itinerary._id" : req.body.itinerary_id},
            {"$push" : { "itinerary.$.meteos_dates" : meteoComponents } },
        );

        res.status(201).send("Meteo data added to itinerary: "+req.body.itinerary_id+"\nBinded to user: "+req.body.user_id+"\n");   // Messaggio di risposta
    
    }catch(err){
        res.status(400).send("Itinerary with id:"+req.body.itinerary_id+" not found");      // Messaggio in caso di errore
    }

});

/* Definizione del metodo DELETE: rimuove una meteocComponent dall'itinerario specificato appartenente all'utente specificato.
Richiede un oggetto JSON nel body della richiesta con i campi:
- user_id: l'ID dell'utente a cui appartiene l'itinerario da aggiornare
- itinerary_id: l'ID dell'itinerario da modificare appartenente a tale utente
- meteo_id: l'ID della meteoComponent che dev'essere rimossa da tale itinerario.
*/
router.delete('', async (req,res)=> {

    try{
        await User.updateOne(             // Aggiornamento della lista di itinerari dell'utente specificato tramite la rimozione del meteoComponent specificato
            {"_id": req.body.user_id, "itinerary._id" : req.body.itinerary_id},
            {"$pull" : { "itinerary.$.meteos_dates" : {"_id" : req.body.meteo_id} } }
        );

        res.status(201).send("MeteoComponent "+req.body.meteo_id+" deleted\nItinerary "+req.body.itinerary_id+" updated.\n");   // Messaggio di risposta
    
    }catch(err){
        res.status(400).send("Meteocomponent "+req.body.meteo_id+" not found.\n");          // Messaggio di errore
    }

});


module.exports = router;