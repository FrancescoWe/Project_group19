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

async function deleteUserMeteoComponents(user_id,itinerary_id,meteo_id){
    try{
        await User.updateOne(             // Aggiornamento della lista di itinerari dell'utente specificato tramite la rimozione del meteoComponent specificato
            {"_id": user_id, "itinerary._id" : itinerary_id},
            {"$pull" : { "itinerary.$.meteos_dates" : {"_id" : meteo_id} } }
        );
        return true
    } catch (err){
        return false
    }
}


/* Definizione del metodo GET: ricerca i meteoComponents dell'itinerario specificato, appartenente all'utente specificato.
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

router.delete('/deleteAll', async (req,res)=> {
    try{

        let founditinerary = await User.findOne(                                
            {"_id": req.body.user_id},
            { "itinerary" : {$elemMatch : {"_id" : req.body.itinerary_id}}} 
        );        
        console.log(founditinerary.itinerary[0].meteos_dates)   ;                                                                     
        founditinerary.itinerary[0].meteos_dates=[];
        founditinerary.save();
        res.status(201).send("All meteoComponents from itinerary have been deleted");        

    } catch(err){
        console.log(err);
        res.status(400).send({error: err});                 
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

        res.status(201).send({
            success : "MeteoComponent "+req.body.meteo_id+" deleted\nItinerary "+req.body.itinerary_id+" updated.\n"
        });   // Messaggio di risposta
    
    }catch(err){
        res.status(400).send({
            error : "Meteocomponent "+req.body.meteo_id+" not found."
        });          // Messaggio di errore
    }

});


router.patch('', async (req,res)=>{
    var tempCurrentDate = new Date().getTime() / 1000

    var currentDate = tempCurrentDate.toFixed(0)

    try{
        var meteos_datesA
        User.findById(req.body.user_id)
            .then((user) => {
                meteos_datesA = user.itinerary.id(req.body.itinerary_id).meteos_dates.id(req.body.meteo_id);
                const userDate = meteos_datesA.date
                console.log(userDate)
                const oneDay = 24 * 60 * 60
                const diffDays = Math.ceil(Math.abs((userDate - currentDate) / oneDay))
                if(userDate < currentDate){
                    deleteUserMeteoComponents(req.body.user_id,req.body.itinerary_id,req.body.meteo_id) ?
                    res.status(200).send({
                        success :  "Meteo Component was in the past, it was deleted."
                    })
                        :
                    res.send(400).send({
                        error : "There was an error : " + err
                    })
                } else {
                    console.log("Differenza giorni da data odierna : " + diffDays)
                    if(diffDays > 7){
                        res.status(201).send({
                            success : "Meteo was too in the future. Kept available = false."
                        })
                    } else
                        try{
                            requestcoords('https://photon.komoot.io/api/?q='+meteos_datesA.cityName+'&limit=1',function(err,jsoncoords){
                                if(err){
                                    res.status(400).send({
                                        error : "Error in the request. Please retry."
                                    });
                                } else {
                                    let lat = jsoncoords.features[0].geometry.coordinates[1];
                                    let lon = jsoncoords.features[0].geometry.coordinates[0];

                                    meteoUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts,current&units=metric&appid='+process.env.API_KEY;
                                    
                                    request(meteoUrl, function(error,response,body){  
                                        const meteo_json=JSON.parse(body);
                                        var toSave = meteo_json.daily[diffDays]
                                        meteos_datesA.available = true,
                                        //meteos_datesA.cityName = jsoncoords.features[0].properties.name,
                                        //meteos_datesA.date = userDate,
                                        meteos_datesA.dataUpdatedOn = currentDate,
                                        meteos_datesA.temp = toSave.temp.day,
                                        meteos_datesA.temp_Max = toSave.temp.max,
                                        meteos_datesA.temp_Min = toSave.temp.min,
                                        meteos_datesA.humidity = toSave.humidity,
                                        meteos_datesA.icon = toSave.weather[0].icon,
                                        meteos_datesA.main = toSave.weather[0].main,
                                        meteos_datesA.wind_deg = toSave.wind_deg,
                                        meteos_datesA.wind_speed = toSave.wind_speed
                                        
                                        res.status(201).send({
                                            success : "Meteo PATCHED in itinerary: "+req.body.itinerary_id+"\nBinded to user: "+req.body.user_id
                                        })
                                        user.save()
                                    });
                                }
                            });
                        }catch(err){
                            res.status(400).send({
                                error : "There was an error : " + err
                            });
                        }
                    }    
            }).catch(e => res.status(400).send({
                error : "There was an error : " + e
            }));
    }catch(err){
        res.status(400).send({
            error: "There was an error : " + err
        });
    }
})

/*
function checkNull(variabile){
    if (variabile==null) return false;
    if(variabile=="") return false;
    return true;
}
*/

module.exports = router;