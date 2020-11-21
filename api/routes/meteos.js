// Route di "meteos"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const Meteo = require('../models/meteo');

// Variabili globali
var meteoCurrentUrl = ""; // 'http://api.openweathermap.org/data/2.5/weather?q=Trento&units=metric&appid='+ process.env.API_KEY;
var meteoForecastUrl= ""; // 'http://api.openweathermap.org/data/2.5/forecast?q=Trento&units=metric&appid='+ process.env.API_KEY;


// Definizione del metodo GET: restituisce un messaggio che informa riguardo la gestione della richiesta
router.get('/', (req,res,next) => {
    res.status(201).json({
        message: 'Handling GET request to /meteos'
    });
});

// Definizione del metodo GET con path "/current/:cityName": ottiene i dati del meteo corrente della città "cityName".
router.get('/current/:cityName', function(req,res){
    meteoCurrentUrl = 'http://api.openweathermap.org/data/2.5/weather?q='+req.params.cityName+'&units=metric&appid='+ process.env.API_KEY;
    request(meteoCurrentUrl, function(error,response,body){     // Viene mandata una richiesta all'URL specificato, passando come parametro la funzione per la gestione della response
        const meteo_json=JSON.parse(body);                      // Parsing del body in JSON
        res.status(201).json(meteo_json);                                   // Restituzione dell'oggetto in formato JSON
        console.log(meteo_json);
    });
    /*request(meteoForecastUrl, function(error,response,body){
        const meteo_fore_json=JSON.parse(body);
        res.json(meteo_fore_json);
        console.log(meteo_fore_json);
    });*/
});

// Definizione del metodo GET con path "/forecast/:cityName": ottiene i dati del meteo di oggi e dei prossimi 4 giorni della città ":cityName"
router.get('/forecast/:cityName', function(req,res){
    meteoForecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?q='+req.params.cityName+'&units=metric&appid='+ process.env.API_KEY; 
    request(meteoForecastUrl, function(error,response,body){        // Viene mandata una richiesta all'URL specificato, passando come parametro la funzione per la gestione della response
        const meteo_fore_json=JSON.parse(body);                     // Parsing del body in JSON
        res.status(201).json(meteo_fore_json);                                  // Restituzione dell'oggetto in formato JSON
        console.log(meteo_fore_json);           
    });     
});


// Definizione del metodo POST: crea un oggetto meteo
router.post('/',function(req,res){
    Meteo.create(req.body).then(function(meteo){
        res.status(201).send(meteo);
        console.log('Ha funzionato(!)');
    });
});

module.exports = router;