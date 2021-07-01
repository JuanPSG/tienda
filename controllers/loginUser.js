/*jshint esversion: 6*/


const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('../models/user');

module.exports = (req, res) =>{
    const {username, password} = req.body;

    console.log(username);
    console.log(password);
    User.findOne({username: username}, (error, user) => {

        if(user){
            bcrypt.compare(password, user.password,(error, same) =>{

                if(same){
                   //req.session.userId = user._id;
                   console.log('si entro a same'); 
                   res.redirect('/');
                }
                else {
                    console.log('no es el mismo password');
                    res.redirect('/auth/login');
                }
            });
        }

        else{
            console.log('No encuentra usuario');
            res.redirect('/auth/login');
        }

    });

};