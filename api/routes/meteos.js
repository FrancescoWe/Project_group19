// Route di "meteos"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const Meteo = require('../models/meteo');

// Variabili globali
var meteoUrl = ""; // 'http://api.openweathermap.org/data/2.5/weather?q=Trento&units=metric&appid='+ process.env.API_KEY;


// Definizione del metodo GET: restituisce un messaggio che informa riguardo la gestione della richiesta
router.get('/', (req,res,next) => {
    res.status(201).json({
        message: 'Handling GET request to /meteos'
    });
});

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

/*
router.get('/testing/:cityName',function(req,res){
    requestcoords('https://photon.komoot.io/api/?q='+req.params.cityName+'&limit=1',function(err,jsoncoords){
        if(err){
            res.send("Error in the request. Please retry.\n");
        } else {
            let lat = jsoncoords.features[0].geometry.coordinates[1];
            let lon = jsoncoords.features[0].geometry.coordinates[0];
            console.log("Coordinate lat lon : "+lat+" "+lon);
            res.send("Coordinate lat lon : "+lat+" "+lon);
        }
    });
});
*/

// Definizione del metodo GET con path "/cityName": ottiene i dati del meteo in forma di json della città "cityName".
router.get('/:cityName', function(req,res){
    if(!req.params.cityName)
        res.status(400).send("You must provide a city name in the URL.");
    else{
        requestcoords('https://photon.komoot.io/api/?q='+req.params.cityName+'&limit=1',function(err,jsoncoords){
        if(err){
            res.status(400).send("Error in the request. Please retry.");
        } else if(Object.keys(jsoncoords.features).length == 0){
            res.status(400).send("You must provide a valid city name in the URL.");
        }else {
            let lat = jsoncoords.features[0].geometry.coordinates[1];
            let lon = jsoncoords.features[0].geometry.coordinates[0];

            //console.log("Coordinate lat lon : "+lat+" "+lon);

            meteoUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts&units=metric&appid='+process.env.API_KEY;
            
            request(meteoUrl, function(error,response,body){     // Viene mandata una richiesta all'URL specificato, passando come parametro la funzione per la gestione della response
                const meteo_json=JSON.parse(body);                      // Parsing del body in JSON
                if(!jsoncoords.features[0].properties.county)
                    meteo_json.name = jsoncoords.features[0].properties.name + ", "+jsoncoords.features[0].properties.country;
                else
                    meteo_json.name = jsoncoords.features[0].properties.name + ", "+jsoncoords.features[0].properties.county+", "+jsoncoords.features[0].properties.country;
                //console.log("Nome citta': "+meteo_json.name);
                res.send(meteo_json);
                //res.status(201).json(meteo_json);                                   // Restituzione dell'oggetto in formato JSON
            });
        }
        });
    }
});

// Definizione del metodo POST: crea un oggetto meteo
router.post('/',function(req,res){
    Meteo.create(req.body).then(function(meteo){
        res.status(201).send(meteo);
        console.log('Ha funzionato(!)');
    });
});

module.exports = router;