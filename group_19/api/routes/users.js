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

module.exports = router;