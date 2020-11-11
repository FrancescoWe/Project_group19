const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Meteo = require('../models/meteo')

router.get('/', (req,res,next) => {
    res.status(200).json({
        message: 'Handling GET request to /meteos'
    });
});


router.post('/',function(req,res){
    
    Meteo.create(req.body).then(function(meteo){
        res.send(meteo);
        console.log('ha funzionato(!)');
    });
});

module.exports = router;