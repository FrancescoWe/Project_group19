// Modello di un oggetto "meteoComponent"

const mongoose = require('mongoose');

const MeteoComponentSchema = mongoose.Schema({

    //itinerary_id: mongoose.Schema.Types.ObjectId,

    temp_Max: {
        type: String,
    },
    temp_Min: {
        type: String,
    },
    date:{
        type: String,
        required: [true, 'Date is strictly required']
    },
    cityName:{
        type: String,
        required: [true, 'The name of the city is strictly required']
    }
});

// Aggiunta del modello al DB
const MeteoComponent = mongoose.model('meteoComponent',MeteoComponentSchema);

module.exports = MeteoComponent;