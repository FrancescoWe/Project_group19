const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MeteoComponent = require('../models/meteoComponent');
const Itinerary = require('../models/itinerary');
const User = require('../models/user');

const db = mongoose.connection;

//ricerca gli itinerari di tutti gli user.
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

//crea un itinerario vuoto e lo salva, connettendolo ad un utente singolo (specifica l'id dell' utente nel body della post)
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

    //res.send("Inviato e collegato all' utente :"+req.body.id+" correttamente");
    res.send("Inviato e collegato all' utente :"+userfound._id+" correttamente");
});

module.exports = router;