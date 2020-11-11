const mongoose = require('mongoose');

// Connect to mongoDB
mongoose.connect('mongodb://localhost/testaroo');

mongoose.connection.once("open", function(){
    console.log("Connection has been made, now make fireworks");
}).on('error',function(){
    console.log('Connection error: ', error);
});