const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MeteoComponent = require('../models/meteoComponent');
const Itinerary = require('../models/itinerary');
const User = require('../models/user');

const db = mongoose.connection;

//ricerca tutti gli user
router.get('/', async(req,res,next) => {
    let itineraries = await Itinerary.find({}).exec();
    itineraries = itineraries.map( (itinerary) => {
        return {
            id: itinerary.id,
            user_id : itinerary.user_id
        };
    });
    res.status(200).json(itineraries);
});

/*
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
*/

//crea un meteoComponent e lo salva
router.post('', async (req, res) => {

    const userfound = await User.findOne({_id: req.body.id});

    console.log(req.body.id);

    if(userfound == null){
        res.status(400).json({ error: "This user with the id :"+ req.body.id +" does not exist" });
        return;
    } else {
        let newitinerary = new Itinerary({
            user_id : req.body.id,
        });

        newitinerary = await newitinerary.save();

        await User.updateOne(
            {_id: userfound},
            {$push : {itinerary: newitinerary._id}}
        );
        
        console.log('Itinerary saved successfully.');
    }

    res.send("Inviato Correttamente");
    /*
    let useridcheck = await User.find({}).exec();
    useridcheck = useridcheck.map( (user) => {
        if(userid == user.id)
            console.log("One user with id "+userid+" found. Progressing.");
    });
    */

    /*
	let meteoComponent = new MeteoComponent({
        temp_Max: req.body.temp_Max,
        temp_Min: req.body.temp_Min,
        date: req.body.date,
        cityName: req.body.cityName
    });
    
	meteoComponent = await meteoComponent.save();
    
    let meteoComponentId = meteoComponent.id;

    console.log('meteoComponent saved successfully');

    res.location("/api/v1/meteoComponents/" + meteoComponentId).status(201).send();
    */
});


module.exports = router;