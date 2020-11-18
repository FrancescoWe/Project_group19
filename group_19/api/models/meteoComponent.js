const mongoose = require('mongoose');

const MeteoComponentSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
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

const MeteoComponent = mongoose.model('meteoComponent',MeteoComponentSchema);



module.exports = MeteoComponent;//mongoose.model('User', userSchema);