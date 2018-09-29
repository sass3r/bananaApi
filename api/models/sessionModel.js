'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    token: {
	    type: String,
	    required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    expiry_date: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model('Sessions',SessionSchema);
