const express = require('express');
const users = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
users.use(cors());

process.env.SECRET_KEY = 'secret';

users.post('/register', (req, res) => {
    const today = new Date();
    const userData = {
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        email : req.body.email,
        password: req.body.email,
        created: today
    }

    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(!user){
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                userData.password = hash;
                User.create(userData)
                .then(user => {
                    res.json({status: user.email + 'registrado'})
                })
                .catch(err => {
                    res.send('error: ' + err)
                })
            })
        } else {
            res.json({ error: 'El usuario ya existe '})
        }
    })
    .catch(err => {
        res.send('Error: ' + err)
    })
})

users.post('/login', (req,res) => {
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(user){
            if(bcrypt.compareSync(req.body.password, user.password)){
                const payload = {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.send(token);
            } else {
                res.json({error: "Contraseña incorrecta"})
            }
        } else {
            res.json({error: "El ususario no existe"})
        }
    })
    .catch(err => {
        res.send('error ' + err)
    })
})

module.exports = users