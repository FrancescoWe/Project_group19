const mongoose = require('mongoose');
const MeteoComponent = require('./meteoComponent');

const ItinerarySchema = mongoose.Schema({
    
    user_id: mongoose.Schema.Types.ObjectId,
    
    meteos_dates : {
        type : [String],
    }

});

const Itinerary = mongoose.model('itinerary',ItinerarySchema);

module.exports = Itinerary;