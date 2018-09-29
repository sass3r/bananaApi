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
    let token = jwt.sign({user:new_user.name},secret);
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
    res.status(200).send({auth:true,token:token});
};

function autorizarAcceso(walletId) {
    const multichain = spawn('multichain-cli',['YanaptiChain','grant',walletId,'connect,send,receive']);

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
    let username = req.body.name;
    let password = req.body.password;
    
    let token = jwt.sign({user:'root'},secret);
    res.status(200).send({auth:true,token:token});
};
