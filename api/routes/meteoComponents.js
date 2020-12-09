// Route di "meteoComponents"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../models/user");
const MeteoComponent = require("../models/meteoComponent");
const request = require('request');

// Connessione al DB
const db = mongoose.connection;

/* Definizione del metodo GET: ricerca i meteoComponents dell'itinerario specificato, appartenente all'utente specificato.
Richiede un oggetto JSON nel body della richiesta con i campi:
- user_id: l'ID dell'utente di cui si vogliono avere le informazioni
- itinerary_id: l'ID dell'itinerario di cui si vogliono avere le meteoComponents.*/
router.get('/:user_id&:itinerary_id', async(req,res) => {
    try{
        
        let founditinerary = await User.findOne(                                // Ricerca dell'utente corrispondente all'id specificato
            {"_id": req.params.user_id},
            { "itinerary" : {$elemMatch : {"_id" : req.params.itinerary_id}}}     // Ricerca dell'itinerary specificato
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
- temp_Min: la temeratura minima del nuovo meteoComponent
- date: la data corrispondente al nuovo meteoComponent
- cityName: la città corrispondente al nuovo meteoComponent.*/
router.post('', async (req, res) => {

    var meteoComponents

    var currentDate = new Date().getTime() / 1000

    var userDate = req.body.date

    if(userDate < currentDate){
        res.status(400).send({
            error :  "Date provided is in the past or it's today!"
        })
    } else {
        const oneDay = 24 * 60 * 60
        const diffDays = Math.ceil(Math.abs((userDate - currentDate) / oneDay))

        if(diffDays > 7){
            meteoComponents = new MeteoComponent({      // Creazione del nuovo meteoComponent
                available : false,
                cityName : req.body.cityName,
                date : userDate,
            })

            res.status(201).send({
                success : "Meteo NOT AVAILABLE added to itinerary: "+req.body.itinerary_id+"\nBinded to user: "+req.body.user_id+"\n"
            });   // Messaggio di risposta

        } else {

            requestURL = "/meteos/" + req.body.cityName

            console.log(diffDays)

            var toSave

            try{
                request (requestURL,function(error,body,response){
                    console.log(response)
                    toSave = response.daily[diffDays]
                    meteoComponents = new MeteoComponent({      // Creazione del nuovo meteoComponent
                        available : true,
                        cityName : req.body.cityName,
                        date : userDate,
                        dataUpdatedOn : currentDate,
                        temp : toSave.temp.day,
                        temp_Max : toSave.temp.max,
                        temp_Min : toSave.temp.min,
                        humidity : toSave.humidity,
                        icon : toSave.weather[0].icon,
                        main : toSave.weather[0].main,
                        wind_deg : toSave.wind_deg,
                        wind_speed : toSave.wind_speed,
                    })
                })

                res.status(201).send({
                    success : "Meteo AVAILABLE AND FILLED added to itinerary: "+req.body.itinerary_id+"\nBinded to user: "+req.body.user_id+"\n"
                });   // Messaggio di risposta

            }catch(err){
                res.status(400).send({
                    error : "Itinerary with id:"+req.body.itinerary_id+" not found"
                });      // Messaggio in caso di errore
            }   
        }
        
        await User.updateOne(              // Aggiornamento della lista di itinerari dell'utente specificato tramite l'aggiunta il meteoComponent appena creato
            {"_id": req.body.user_id, "itinerary._id" : req.body.itinerary_id},
            {"$push" : { "itinerary.$.meteos_dates" : meteoComponents } },
        );
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

router.patch('/:userId', async (req,res)=>{
    try{
        User.findById(req.params.userId)
            .then((user) => {
            const meteos_datesA = user.itinerary.id(req.body.itinerary_id).meteos_dates.id(req.body.meteos_id);
            //console.log("WHAAAAAAA2"+user);
            //meteos_datesA.set(req.body); // updates the address while keeping its schema       
            if(checkNull(req.body.cityName)) meteos_datesA.cityName=req.body.cityName;
            if(checkNull(req.body.date)) meteos_datesA.date=req.body.date;
            if(checkNull(req.body.dataUpdatedOn)) meteos_datesA.dataUpdatedOn=req.body.dataUpdatedOn;
            if(checkNull(req.body.available)) meteos_datesA.available=req.body.available;
            if(checkNull(req.body.temp_Max)) meteos_datesA.temp_Max=req.body.temp_Max;
            if(checkNull(req.body.temp_Min)) meteos_datesA.temp_Min=req.body.temp_Min;
            if(checkNull(req.body.humidity)) meteos_datesA.humidity=req.body.humidity;
            if(checkNull(req.body.icon)) meteos_datesA.icon=req.body.icon;
            if(checkNull(req.body.main)) meteos_datesA.main=req.body.main;
            if(checkNull(req.body.wind_deg)) meteos_datesA.wind_deg=req.body.wind_deg;
            if(checkNull(req.body.wind_speed)) meteos_datesA.wind_speed=req.body.wind_speed;


            return user.save()    
            })
            .then((user) => {
            //console.log("WHAAAAAAA"+user);
            res.send({ user });
        })
        .catch(e => res.status(400).send(e));
  ///
    }catch(err){
        console.log(err);
        res.status(400).json({message: err});
    }
})

function checkNull(variabile){
    if (variabile==null) return false;
    if(variabile=="") return false;
    return true;
}


module.exports = router;