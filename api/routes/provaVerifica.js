// Route per la verifica dell'autenticazione -- DA AGGIORNARE

const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const User = require('../models/user');


router.get('/', verify, async (req,res) => {
    //res.send(req.user);
    console.log(req.user);
    let usertry = await User.findOne({_id: req.user._id});
    res.send(usertry);
});

module.exports = router;