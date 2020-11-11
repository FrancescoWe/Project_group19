const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: [true, 'Email field is required']
    },
    password: {
        type: String,
        required: [true, 'Password field is required']
    }
    
});

const User = mongoose.model('user',UserSchema);

module.exports = User;//mongoose.model('User', userSchema);