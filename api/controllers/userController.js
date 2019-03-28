'use strict';
const { spawn } = require('child_process');
var mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Session = mongoose.model('Sessions'),
    jwt = require('jsonwebtoken'),
    secret = 'h4pp1 h4ck1ng';

exports.list_all_users = function(req, res) {
    User.find({}, function(error, user){
        if(error){
            res.send(error);
        }
        res.json(user);
    });
};

exports.create_a_user = function(req, res) {
    let new_user = new User(req.body);
    console.log(req.body);
    new_user.save(function(error, user){
        if(error){
            console.log(error);
        }
        console.log(user);
    });
    console.log(new_user.name);
    let token = jwt.sign({user:new_user.email},secret);
    let session = {
        "user_id": new_user._id,
        "token": token,
    };
    let new_session = new Session(session);
    new_session.save((error)=>{
        if(error){
            console.log("Error al crear la sesion");
        }
        console.log(session);
    });
    autorizarAcceso(new_user.wallet);
    res.status(200).send({auth:true, token:token, user: new_user._id});
};

function autorizarAcceso(walletId) {
    const multichain = spawn('multichain-cli',['BananaChain','grant',walletId,'connect,send,receive']);

    multichain.stdout.on('data',(data)=>{
        console.log(`stdout: ${data}`);
    });

    multichain.stderr.on('data',(data)=>{
        console.log(`stderr: ${data}`);
    });

    multichain.on('close',(code)=>{
        console.log(`child process exited with code ${code}`);
    });
}

exports.sign_in = function(req, res) {
    let username = req.body.email;
    let password = req.body.password;

    User.findOne({email: username},function(err,user){
        if(!err) {
            let usuario = user;
            if(usuario) {
                usuario.comparePassword(password, function (err, esIgual) {
                    if (!err) {
                        if (esIgual) {
                            let token = jwt.sign({user: user.email}, secret);
                            let session = {
                                "user_id": usuario._id,
                                "token": token,
                            };
                            let new_session = new Session(session);
                            new_session.save((error)=>{
                                if(error){
                                    console.log("Error al crear la sesion");
                                }
                                console.log(session);
                            });
                            res.status(200).send({auth: true, token: token, user: usuario._id});
                        } else {
                            res.status(401).send({reason: 'invalid password'});
                        }
                    }
                });
            }else{
                res.status(401).send({reason:'invalid user'});
            }
        }
    })
};
