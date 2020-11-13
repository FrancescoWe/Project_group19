const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const Meteo = require('../models/meteo');
var meteoUrl = 'http://api.openweathermap.org/data/2.5/weather?q=Trento,it&units=metric&appid='+ process.env.API_KEY;

router.get('/', (req,res,next) => {
    res.status(200).json({
        message: 'Handling GET request to /meteos'
    });
});

router.get('/:cityName', function(req,res){
    meteoUrl = 'http://api.openweathermap.org/data/2.5/weather?q='+req.params.cityName+',it&units=metric&appid='+ process.env.API_KEY;
    request(meteoUrl, function(error,response,body){
        const meteo_json=JSON.parse(body);
        res.json(meteo_json);
        console.log(meteo_json);
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