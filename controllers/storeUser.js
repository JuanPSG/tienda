/*jshint esversion: 6*/
const User = require('../models/user');
const path = require('path');

module.exports = (req,res) =>{

    
    let user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    
    user.save( (error, user) =>{
    
        if(error) res.status(500).send({
            message: `error al guardar en la BD ${err}`
        });
        res.redirect('/');
    });
    };
    