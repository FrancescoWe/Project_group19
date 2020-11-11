const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')

router.get('/', (req,res,next) => {
    res.status(200).json({
        message: 'Handling GET request to /users'
    });
});


router.post('/',function(req,res){
    /*console.log(req.body);
    var user = new User(req.body);
    console.log(user);
    user.save(function(err){
        console.log("ha funzionato strano");
        if(err){res.send(err);}
        res.json(user);
    });*/
    //user.save();
    User.create(req.body).then(function(user){
        res.send(user);
        console.log('ha funzionato(?)');
    });
});

/*router.put('/:id', function(req,res){
    res.send({type:'PUT'});
});

router.delete('/:id', function(req,res){
    res.send({type: 'DELETE'});
});*/

/*router.post('/', (req,res,next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(), //a unique id created
        email: req.body.email,
        password: req.body.password
    });
  
    user.save().then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));
    res.status(201).json({
        message: "Handling post request to user",
        createdUser: user
    });
});*/

module.exports = router;