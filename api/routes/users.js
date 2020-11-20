// Route di "users"

// Costanti globali
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')

// Connessione al DB
const db = mongoose.connection;

// Definizione del metodo GET: ricerca tutti gli user
router.get('/', async(req,res,next) => {
    try{
        const users = await User.find();
        console.log(users);
        res.json(users);
    }catch(err){
        res.json({message: err});
    }
});

// Definizione del metodo GET con path "/:email": ottiene le informazioni sullo user con la mail "email" utilizzando la API
router.get('/:email', async (req,res)=> {
    try{
        const users = await User.findOne({email: req.params.email})
        .map((entry) => {
            return{
                self: '/api/v1/users/' +entry.id,
                email: entry.email
            }
        });
        //console.log(users);
        res.status(200).json(users);
    }catch(err){
        res.json({message: err});
    }
});


// Definizione del metodo GET con path ":userId": ottiene le informazioni sullo user con id "userId" utilizzando la API
router.get('/:userId', async (req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        res.json(user);
    }catch(err){
        res.json({message: err});
    }
});


/* Definizione del metodo POST: crea uno user e lo salva nel DB.
Richiede un oggetto JSON nel body della richiesta con i campi relativi ad uno user.
Se esiste giù un utente con la mail specificata, restituisce un messaggio di errore. */
router.post('/',async function(req,res){
    console.log(req.body.email);
    const usertwo = await User.findOne({email: req.body.email});    // Ricerca nel DB di un utente con la mail specificata
    if(usertwo==null){                                              // Caso in cui non esiste già un utente con la mail specificata
        User.create(req.body).then(function(user){                  // Viene creato un utente
            if(!user.email || typeof user.email!= 'string' || !checkIfEmailInString(user.email)){   // Se la mail non è nel formato corretto, restituisce un errore
                res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
                return;
                };
            res.send(user);                                         // altrimenti, viene restituito il nuovo utente
            console.log('Aggiunto user');
        });
    }else{                                                          // Caso in cui esiste già un utente con la mail specificata
        res.status(400).json({ error: 'This email is already taken' }); // Errore
        return;
    }
});


/* Definizione del metodo DELETE: elimina un determinato user
Richiede un oggetto JSON nel body della richiesta con il campo "userId" dell'utente che si intende eliminare*/
router.delete('', async (req,res)=> {

    try{
        let removedUser = await User.deleteOne({_id: req.body.userId})
        res.send("User with id "+req.body.userId+" successfully deleted.");
        console.log("User with id "+req.body.userId+" successfully deleted.");
    }catch(err){
        res.send("User with id "+req.body.userId+" not found.");
        console.log("User with id "+req.body.userId+" not found.");
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
        res.json(updatedUser);                      // Restituzione dell'utente con le informazioni aggiornate
    }catch(err){
        res.json({message: err});
    }
})

// Funzione ausiliaria: verifica che il campo compilato sia effetticamente una stringa
function checkIfEmailInString(text) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}


module.exports = router;