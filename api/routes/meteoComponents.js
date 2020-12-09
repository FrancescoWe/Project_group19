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

function requestcoords(path,callback){
    request(path, function(err, response, body) {
        if (err) {
            callback(err,null)
        } else {
            city_json=JSON.parse(body);
            callback(null,city_json);
        }
    });
}

async function updateUserMeteoComponents(user_id,itinerary_id,meteoComponents){
    try{
        await User.updateOne(              // Aggiornamento della lista di itinerari dell'utente specificato tramite l'aggiunta il meteoComponent appena creato
            {"_id": user_id, "itinerary._id" : itinerary_id},
            {"$push" : { "itinerary.$.meteos_dates" : meteoComponents } },
        );
        return true
    } catch (err){
        return false
    }
}


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
- date: la data che vuole l' utente
- cityName: la città che vuole l' utente.*/
router.post('', async (req, res) => {

    var meteoComponents

    var tempCurrentDate = new Date().getTime() / 1000

    var currentDate = tempCurrentDate.toFixed(0)

    var userDate = req.body.date

    if(userDate < currentDate){
        res.status(400).send({
            error :  "Date provided is in the past or it's today!"
        })
    } else {
        const oneDay = 24 * 60 * 60
        const diffDays = Math.ceil(Math.abs((userDate - currentDate) / oneDay))
        console.log("Differenza dei giorni fra data corrente e data dell' utente: " + diffDays)

        if(diffDays > 7){
            meteoComponents = new MeteoComponent({      // Creazione del nuovo meteoComponent
                available : false,
                cityName : req.body.cityName,
                date : userDate,
            })

            try{
                await User.updateOne(              // Aggiornamento della lista di itinerari dell'utente specificato tramite l'aggiunta il meteoComponent appena creato
                    {"_id": req.body.user_id, "itinerary._id" : req.body.itinerary_id},
                    {"$push" : { "itinerary.$.meteos_dates" : meteoComponents } },
                );
                res.status(201).send({
                    success : "Meteo NOT AVAILABLE added to itinerary: "+req.body.itinerary_id+"\nBinded to user: "+req.body.user_id+"\n"
                });   // Messaggio di risposta    
            } catch (err) {
                res.status(400).send({
                    error : err
                });      // Messaggio in caso di errore
            } 

        } else {
            try{
                requestcoords('https://photon.komoot.io/api/?q='+req.body.cityName+'&limit=1',function(err,jsoncoords){
                    if(err){
                        res.status(400).send({
                            error : "Error in the request. Please retry."
                        });

                    } else if(Object.keys(jsoncoords.features).length == 0){
                        res.status(400).send({
                            error: "You must provide a valid city name"
                        });

                    } else {
                        let lat = jsoncoords.features[0].geometry.coordinates[1];
                        let lon = jsoncoords.features[0].geometry.coordinates[0];

                        //console.log("Coordinate lat lon : "+lat+" "+lon);

                        meteoUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts,current&units=metric&appid='+process.env.API_KEY;
                        
                        request(meteoUrl, function(error,response,body){     // Viene mandata una richiesta all'URL specificato, passando come parametro la funzione per la gestione della response
                            const meteo_json=JSON.parse(body);                      // Parsing del body in JSON
                            //console.log("Nome citta': "+meteo_json.name);
                            //console.log("L' oggetto ritornato dalla richiesta alla API di operweather e' : \n" + meteo_json)
                            var toSave = meteo_json.daily[diffDays]
                            meteoComponents = new MeteoComponent({      // Creazione del nuovo meteoComponent
                                available : true,
                                cityName : jsoncoords.features[0].properties.name,
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

                            updateUserMeteoComponents(req.body.user_id , req.body.itinerary_id, meteoComponents) ? 
                                    res.status(201).send({
                                        success : "Meteo AVAILABLE AND FILLED added to itinerary: "+req.body.itinerary_id+"\nBinded to user: "+req.body.user_id
                                    })   // Messaggio di risposta
                                :
                                    res.status(400).send({
                                        error : "Something went wrong while updating the user. Retry."
                                    });      // Messaggio in caso di errore
                        });
                    }
                });

            }catch(err){
                res.status(400).send({
                    error : err
                });      // Messaggio in caso di errore
            }   
        }
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