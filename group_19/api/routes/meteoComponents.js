const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MeteoComponent = require('../models/meteoComponent')

const db = mongoose.connection;

//ricerca tutti gli user
router.get('/', async(req,res,next) => {
    let meteoComponents = await MeteoComponent.find({}).exec();
    meteoComponents = meteoComponents.map( (meteoComponent) => {
        return {
            self: '/api/v1/meteoComponents/' + meteoComponent.id,
            temp_Max: meteoComponent.temp_Max,
            temp_Min: meteoComponent.temp_Min,
            date: meteoComponent.date,
            cityName: meteoComponent.cityName
        };
    });
    res.status(200).json(meteoComponents);
});

//ricerco un componente meteo di un itinerario
router.get('/:id', async (req, res) => {
    let meteoComponent = await MeteoComponent.findById(req.params.id).exec();
    res.status(200).json({
        self: '/api/v1/meteoComponents/' + meteoComponent.id,
        temp_Max: meteoComponent.temp_Max,
        temp_Min: meteoComponent.temp_Min,
        date: meteoComponent.date,
        cityName: meteoComponent.cityName
    });
});

//crea un meteoComponent e lo salva
router.post('', async (req, res) => {

	let meteoComponent = new MeteoComponent({
        temp_Max: req.body.temp_Max,
        temp_Min: req.body.temp_Min,
        date: req.body.date,
        cityName: req.body.cityName
    });
    
	meteoComponent = await meteoComponent.save();
    
    let meteoComponentId = meteoComponent.id;

    console.log('meteoComponent saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/meteoComponents/" + meteoComponentId).status(201).send();
});


module.exports = router;