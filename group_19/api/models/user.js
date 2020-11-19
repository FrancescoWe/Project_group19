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

    itinerary : {
        type : [String],
    }
    
});

const User = mongoose.model('user',UserSchema);

module.exports = User;