const express = require('express');
const app = express();
const bodyParser = require ("body-parser");
const mongoose = require('mongoose');
const userRoutes = require('./api/routes/users');
const meteoRoutes = require('./api/routes/meteos');
require ('dotenv/config');

app.use(bodyParser.urlencoded({extendeed:false}));
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/moteos', meteoRoutes);
app.use(meteoRoutes);
app.use(userRoutes);



//mongoose.connect(DB_CONNECTION);

/*mongoose.connect(process.env.DB_CONNECTION, 
    {useNewUrlParser: true},
    () => console.log('connected to db!')
);*/
mongoose.connect('mongodb://localhost/testaroo',{
  useUnifiedTopology: true,
  useNewUrlParser:true
});
//mongoose.connect('mongodb://localhost/testaroo');
//mongoose.Promise = global.Promise;

//mongoose.connect('mongodb+srv://testingNow:Nowtesting@rest.via14.mongodb.net/rest?retryWrites=true&w=majority');
const db = mongoose.connection;
db.once('open', () => {
    console.log('DB connected successfully!');
  });

module.exports=app;