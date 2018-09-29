'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    name: {
        type: String,
        required: 'Ingrese el nombre de usuario'
    },
    lastname: {
        type: String,
        required: false
    },
    wallet: {
	type: String,
	required: true
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', function(next){
  var user = this;
  if(user.isModified('password')){
      bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(!err){
            bcrypt.hash(user.password,salt,function(err,hash){
              if(!err){
                user.password = hash;
                next();
              }else{
                next(err);
              }
            });
        }else{
          next(err);
        }
      });
  }
});

UserSchema.methods.comparePassword = function(candidatePassword,callback){
  bcrypt.compare(candidatePassword, this.password, function(err, esIgual){
    if(err){
      callback(err);
    }else{
      callback(null,esIgual);
    }
  });
};

module.exports = mongoose.model('Users', UserSchema);
