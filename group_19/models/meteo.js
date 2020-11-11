const mongoose = require('mongoose');

const MeteoSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    temperatura: {
        type: String,
        required: [true, 'Email field is required']
    },
    data: {
        type: String,
    }
    
});

const Meteo = mongoose.model('meteo',MeteoSchema);

module.exports = Meteo;//mongoose.model('User', userSchema);