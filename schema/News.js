'use strict';

/* Imports */
var async    = require('async'),
    _        = require('lodash'),
    mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

var NewsSchema = new Schema({
    title: {
        type     : String,
        required : true,
        trim     : true
    },
    content: {
        type     : String,
        required : true
    },
    author: {
        type     : String,
        required : true,
        trim     : true
    },
    date: {
        type     : Date,
        required : true,
        index    : true
    },
    image: {
        type     : String, // base64
        required : true
    }
});

/* Statics */

/* Methods */

/* Validators */

/* Middleware */

module.exports = mongoose.model('News', NewsSchema);
