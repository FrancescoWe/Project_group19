const mongoose = require('mongoose');

const MeteoSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    temperatura: {
        type: String,
        required: [true, 'temperature required']
    },
    data: {
        type: String,
    }
    
});

const Meteo = mongoose.model('meteo',MeteoSchema);



module.exports = Meteo;//mongoose.model('User', userSchema);