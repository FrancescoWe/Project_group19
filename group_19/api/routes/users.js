const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')

const db = mongoose.connection;

//ricerca tutti gli user
router.get('/', async(req,res,next) => {
    try{
        const users = await User.find();
        console.log(users);
        res.json(users);
    }catch(err){
        res.json({message: err});
    }
});

//Funzione per ottenere lo user con quella determinata mail utilizzando la api
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

//metodo get del prof
/*router.get('/:email', async (req, res) => {
    let users;

    if (req.query.email)
        // https://mongoosejs.com/docs/api.html#model_Model.find
        users = await User.find({email: req.query.email}).exec();
    else
        users = await User.find().exec();

    users = users.map( (entry) => {
        return {
            self: '/api/v1/users/' + entry.id,
            email: entry.email
        }
    });

    res.status(200).json(users);
});*/

//crea uno user nel db lcoale
router.post('/',async function(req,res){
    console.log(req.body.email);
    const usertwo = await User.findOne({email: req.body.email});
    if(usertwo==null){
        User.create(req.body).then(function(user){
            if(!user.email || typeof user.email!= 'string' || !checkIfEmailInString(user.email)){
                res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
                return;
                };
            res.send(user);
            console.log('Aggiunto user');
        });
    }else{
        res.status(400).json({ error: 'This email is already taken' });
        return;
    }
});

//ricerca uno user specifico
router.get('/:userId', async (req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        res.json(user);
    }catch(err){
        res.json({message: err});
    }
});


//elimina uno specifico user, _id perchè mongoDB genera automaticamente un _id
router.delete('/:userId', async (req,res)=> {
    try{
        const removedUser = await User.deleteOne({_id: req.params.userId})
        res.json(removedUser);
    }catch(err){
        res.json({message: err});
    }
});

//Aggiorna uno User, fa il cambio di mail 
router.patch('/:userId', async (req,res)=> {
    if(!req.body.email || typeof req.body.email!= 'string' || !checkIfEmailInString(req.body.email)){
        res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        return;
    }
    try{
        const updatedUser = await User.updateOne(
            {_id: req.params.userId},
            {$set : {email:  req.body.email}}
        );
        res.json(updatedUser);
    }catch(err){
        res.json({message: err});
    }
})

//Verifica che il campo compilato sia effetticamente una stringa
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}


module.exports = router;
