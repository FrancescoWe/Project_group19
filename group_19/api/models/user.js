// Modello di un oggetto "user"

const mongoose = require('mongoose');
const Itinerary = require('./itinerary');

const UserSchema = mongoose.Schema({

    email: {
        type: String,
        required: [true, 'Email field is required']
    },

    password: {
        type: String,
        required: [true, 'Password field is required']
    },

    // il campo "itinerary" serve per collegare itinerari all'utente
    itinerary : {
        type : [String],
    }
    
});

const User = mongoose.model('user',UserSchema);

module.exports = User;