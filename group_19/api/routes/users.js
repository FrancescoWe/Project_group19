const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')

router.get('/', async(req,res,next) => {
    try{
        const users = await User.find();
        console.log(users);
        res.json(users);
    }catch(err){
        res.json({message: err});
    }
});


router.post('/',function(req,res){
    User.create(req.body).then(function(user){
        if(!user.email || typeof user.email!= 'string' || !checkIfEmailInString(user.email)){
            res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
            return;
        }
        res.send(user);
        console.log('ha funzionato(?)');
    });
});



//const db = mongoose.connection;

router.get('/:userId', async (req,res)=>{
    try{
        const user =await User.findById(req.params.userId);
        res.json(user);
    }catch(err){
        res.json({message: err});
    }
});


function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}


module.exports = router;