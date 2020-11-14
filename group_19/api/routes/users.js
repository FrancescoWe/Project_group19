const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')

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

//crea uno user nel db lcoale
router.post('/',function(req,res){
    User.create(req.body).then(function(user){
        if(!user.email || typeof user.email!= 'string' || !checkIfEmailInString(user.email)){
            res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
            return;
        }
        res.send(user);
        console.log('Aggiunto user');
    });
});

//ricerca uno user specifico
router.get('/:userId', async (req,res)=>{
    try{
        const user =await User.findById(req.params.userId);
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