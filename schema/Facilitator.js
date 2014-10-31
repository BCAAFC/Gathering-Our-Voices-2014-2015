'use strict';

/* Imports */
var async    = require('async'),
    _        = require('lodash'),
    mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

var FacilitatorSchema = new Schema({
    name: { // This is the facilitator! The workshop is .workshop
        type     : String,
        trim     : true,
        required : true
    },
    affiliation: {
        type     : String,
        trim     : true,
        required : true
    },
    phone: {
        type     : String,
        trim     : true,
        required : true
    },
    fax: {
        type     : String,
        trim     : true,
        required : false
    },
    email: {
        type      : String,
        match     : /.*@.*\..*/, // Most emails.
        trim      : true,
        required  : true,
        lowercase : true,
        index     : {
          unique : true // No duplicates allowed.
        }
    },
    mailing: {
        type     : String,
        trim     : true,
        required : true
    },
    workshop: {
        type     : String,
        trim     : true,
        required : true
    },
    length: {
        type     : String,
        trim     : true,
        required : true,
        enum     : ['1.5', '3', 'Full']
    },
    category: {
        type     : String,
        trim     : true,
        required : true,
        enum     : ['cultural', 'physical', 'emotional', 'mental']
    },
    categoryReason: {
        type     : String,
        trim     : true,
        required : true
    },
    audience: {
        type     : [{
            type : String,
            enum : ['youth', 'youngAdult', 'chaperone']
        }],
        required : true
    },
    type: {
        type     : [{
            type : String,
            enum : ['presentation', 'exercise', 'roleplay', 'qa', 'other']
        }],
        required : true
    },
    description: {
        type     : String,
        trim     : true,
        required : true
    },
    summary: {
        type     : String,
        trim     : true,
        required : true
    },
    interactionLevel: {
        type     : String,
        trim     : true,
        required : true
    },
    equipment: {
        flipchart : Number,
        projector : Boolean,
        screen    : Boolean,
        player    : Boolean
    },
    roomRequirement: {
        type     : String,
        trim     : true,
        required : true,
        enum     : ['circle', 'semicircle', 'gym', 'banquet', 'classroom', 'dance', 'board', 'clear']
    },
    capacity: {
        type     : Number,
        required : true
    },
    biography: {
        type     : String,
        trim     : true,
        required : true
    },
    compensation: {
        meal          : Boolean,
        accommodation : Boolean,
        travel        : String,
        honorarium    : String
    },
    submissionDate: {
        type     : Date,
        required : true,
        default  : Date.now
    }
});

/* Statics */

/* Methods */

/* Validators */

/* Middleware */

module.exports = mongoose.model('Facilitator', FacilitatorSchema);
