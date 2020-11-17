const express = require('express');
const app = express();
const bodyParser = require ("body-parser");
const mongoose = require('mongoose');
require ('dotenv').config();
const request = require('request');
const meteoUrl = 'http://api.openweathermap.org/data/2.5/weather?q=Trento,it&units=metric&appid='+ process.env.API_KEY;

const users = require('./api/routes/users');
//routes constant
const userRoutes = require('./api/routes/users');
const meteoRoutes = require('./api/routes/meteos');

app.use('/', express.static('static'));
//app.use middlewares
app.use(bodyParser.urlencoded({extendeed:false}));
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/meteos', meteoRoutes);
app.use(express.static(__dirname + "/"));

app.use('/api/v1/users', users);


//connecting to db offline
/*mongoose.connect('mongodb://localhost/testaroo',{
  useUnifiedTopology: true,
  useNewUrlParser:true
});

const db = mongoose.connection;
db.once('open', () => {
    console.log('DB connected successfully!');
  });
*/
//using request for weather api from openweather

//faccio una richiesta allo url e una callback function che prende dei parametri
/*request(meteoUrl, (error, respose, body) => {
const data = JSON.parse(body);
 console.log(data);
})*/

//connessione al db online
mongoose.connect(process.env.DB_CONNECTION_ONLINE,{
  useUnifiedTopology: true,
  useNewUrlParser:true
}).then(()=>{
  console.log("CONNESSO ONLINE")
});


module.exports=app;