const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const Meteo = require('../models/meteo');
var meteoCurrentUrl = 'http://api.openweathermap.org/data/2.5/weather?q=Trento&units=metric&appid='+ process.env.API_KEY;
var meteoForecastUrl= 'http://api.openweathermap.org/data/2.5/forecast?q=Trento&units=metric&appid='+ process.env.API_KEY;

router.get('/', (req,res,next) => {
    res.status(200).json({
        message: 'Handling GET request to /meteos'
    });
});

//prendo i dati del meteo di oggi
router.get('/current/:cityName', function(req,res){
    meteoCurrentUrl = 'http://api.openweathermap.org/data/2.5/weather?q='+req.params.cityName+'&units=metric&appid='+ process.env.API_KEY;
    request(meteoCurrentUrl, function(error,response,body){
        const meteo_json=JSON.parse(body);
        res.json(meteo_json);
        console.log(meteo_json);
    });
    /*request(meteoForecastUrl, function(error,response,body){
        const meteo_fore_json=JSON.parse(body);
        res.json(meteo_fore_json);
        console.log(meteo_fore_json);
    });*/
});

//prendo i dati del meteo di oggi e dei prossimi 4 giorni
router.get('/forecast/:cityName', function(req,res){
    meteoForecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?q='+req.params.cityName+'&units=metric&appid='+ process.env.API_KEY;
    request(meteoForecastUrl, function(error,response,body){
        const meteo_fore_json=JSON.parse(body);
        res.json(meteo_fore_json);
        console.log(meteo_fore_json);
    });
});

/*router.get('/:meteoUrl',async(req,res)=>{
    try{
        request(meteoUrl, (error, respose, body) => {
            const data = JSON.parse(body);
        })
        const meteo = data;
        console.log(meteo);
    }catch(err){
        res.json({message: err});
    }
});*/


router.post('/',function(req,res){
    
    Meteo.create(req.body).then(function(meteo){
        res.send(meteo);
        console.log('ha funzionato(!)');
    });
});

module.exports = router;