// Modello di un oggetto "itinerary"


const mongoose = require('mongoose');
// const MeteoComponent = require('./meteoComponent');

const ItinerarySchema = mongoose.Schema({
    
    // Il campo user_id serve per collegare un itinerario ad un utente.
    user_id: mongoose.Schema.Types.ObjectId,
    
    // Array che conterrà oggetti di tipo meteoComponent
    meteos_dates : {
        type : [String],
    }

});

// Aggiunta del modello al DB
const Itinerary = mongoose.model('itinerary',ItinerarySchema);

module.exports = Itinerary;