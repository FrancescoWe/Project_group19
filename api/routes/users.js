// Route di "users"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const User = require('../models/user');
const Itinerary = require('../models/itinerary');
const MeteoComponent = require('../models/meteoComponent');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connessione al DB
const db = mongoose.connection;

// Definizione del metodo GET: ricerca tutti gli user
router.get('/', async(req,res,next) => {
    try{
        const users = await User.find();
        console.log(users);
        res.status(201).json(users);
    }catch(err){
        res.status(400).json({message: err});
    }
});

// Definizione del metodo GET con path "/:email": ottiene le informazioni sullo user con la mail "email" utilizzando la API
router.get('/:email', async (req,res)=> {
    try{
        const users = await User.findOne({email: req.params.email})
        .map((entry) => {
            return{
                self: '/api/v1/users/' +entry.id,
                email: entry.email,
                itinerary: entry.itinerary
            }
        });
        //console.log(users);
        res.status(201).json(users);
    }catch(err){
        res.status(400).json({message: err});
    }
});


// Definizione del metodo GET con path ":userId": ottiene le informazioni sullo user con id "userId" utilizzando la API
router.get('/:userId', async (req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        res.status(201).json(user);
    }catch(err){
        res.status(400).json({message: err});
    }
});


/* Definizione del metodo POST: crea uno user e lo salva nel DB.
Richiede un oggetto JSON nel body della richiesta con i campi relativi ad uno user.
Se esiste giù un utente con la mail specificata, restituisce un messaggio di errore. */
/*router.post('/',async function(req,res){
    //console.log(req.body.email);
    try{
    const usertwo = await User.findOne({email: req.body.email});    // Ricerca nel DB di un utente con la mail specificata
        if(usertwo==null){                                              // Caso in cui non esiste già un utente con la mail specificata
            User.create(req.body).then(function(user){                  // Viene creato un utente
                if(!user.email || typeof user.email!= 'string' || !checkIfEmailInString(user.email)){   // Se la mail non è nel formato corretto, restituisce un errore
                    res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
                    return;
                    };
                res.status(201).send(user);                                         // altrimenti, viene restituito il nuovo utente
                console.log('Aggiunto user');
            });
        }else{                                                          // Caso in cui esiste già un utente con la mail specificata
            res.status(400).json({ error: 'This email is already taken' }); // Errore
            return;
        }
    }catch{
        res.status(400).send({message: error});
    }
});*/

router.post('', async(req,res) =>{

    //Check if user already in database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');
    if(req.body.password==null){
        return res.status(400).send("Error");
    }else if(req.body.password==""){
        return res.status(400).send("Error");
    }
    //Hash passwords
    const salt = await bcrypt.genSalt(10) // genera una chiave complessa, il numero indica la"complessità" della stringa generata
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //Create a new User
    const user = new User({
        email: req.body.email,
        password: hashedPassword
        //password: req.body.password
    });
    try{
        const savedUser = await user.save();
        console.log(savedUser);
        let userId = savedUser.id;
        //res.status(201).send(savedUser);
        res.location("/api/v1/users/" + userId).status(201).send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async (req,res)=>{
    //Check if user exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email not found');
    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //Create and assing a token usefull to know that a user is logged in
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).status(201).send(token);

    //res.status(201).send("logged in");
})


/* Definizione del metodo DELETE: elimina un determinato user tramite l'id.
Richiede un oggetto JSON nel body della richiesta con il campo "id" dell'utente che si intende eliminare*/
router.delete('', async (req,res)=> {

    try{
        var usertomodify = await User.findOne({_id: req.body.id});
        var infolenIT = Object.keys(usertomodify.itinerary).length;

        for(let i=0;i<infolenIT;i++){

            var itinerarytomodify = await Itinerary.findOne({_id : usertomodify.itinerary[i]});
            var infolenMETEO = Object.keys(itinerarytomodify.meteos_dates).length;

            for(let j=0;j<infolenMETEO;j++){
                await MeteoComponent.deleteOne({_id: itinerarytomodify.meteos_dates[j]});
            }

            await Itinerary.deleteOne({_id: usertomodify.itinerary[i]});
        }

        await User.deleteOne({_id: req.body.id});
        res.status(201).send("User with id "+req.body.id+" successfully deleted.\n"+infolenIT+" itineraries completely cleared.\n");

    }catch(err){
        res.status(400).send("User with id "+req.body.id+" not found.");
    }

});


/* Definizione del metodo DELETE: elimina un determinato user tramite la email.
Richiede un oggetto JSON nel body della richiesta con il campo "email" dell'utente che si intende eliminare*/

// DA AGGIORNARE <-----------------------------------------------------------------------------------------------------------

router.delete('/:email', async (req,res)=> {
    try{
        let removedUser = await User.deleteOne({email: req.params.email})
        res.status(201).send("User with email "+req.params.email+" successfully deleted.");
        console.log("User with email "+req.params.email+" successfully deleted.");
    }catch(err){
        res.status(400).send("User with email "+req.params.email+" not found.");
        console.log("User with email "+req.params.email+" not found.");
    }
});

/* Definizione del metodo PATCH con path "/:userId": aggiorna la mail dello user con id "userId".
Richiede un oggetto JSON nel body della richiesta con il campo "email" e il nuovo valore dello stesso.*/
router.patch('/:userId', async (req,res)=> {
    if(!req.body.email || typeof req.body.email!= 'string' || !checkIfEmailInString(req.body.email)){       // Verifica del formato della mail.
        res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        return;
    }
    try{
        const updatedUser = await User.updateOne(    // Aggiornamento del campo email
            {_id: req.params.userId},
            {$set : {email:  req.body.email}}
        );
        res.status(201).json(updatedUser);                      // Restituzione dell'utente con le informazioni aggiornate
    }catch(err){
        res.status(400).json({message: err});
    }
})

// Funzione ausiliaria: verifica che il campo compilato sia effetticamente una stringa
function checkIfEmailInString(text) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}


module.exports = router;
