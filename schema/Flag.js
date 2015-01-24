'use strict';

/* Imports */
var async    = require('async'),
    _        = require('lodash'),
    mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId,
    Payment  = require('./Payment'),
    Member   = require('./Member');

// This schema is **only** used internally so we don't need to worry about validating very much.
var FlagSchema = new Schema({
    key: String,
    value: mongoose.Schema.Types.Mixed,
    // This **must** be marked as modified via
    // `flag.markModified('value');`
});

module.exports = mongoose.model('Flag', FlagSchema);
