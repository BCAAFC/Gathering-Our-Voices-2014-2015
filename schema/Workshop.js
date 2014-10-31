'use strict';

/* Imports */
var async    = require('async'),
    _        = require('lodash'),
    mongoose = require("mongoose"),
    bcrypt   = require("bcrypt"),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

/* Schema */
var WorkshopSchema = new Schema({
    name: {
        type       : String,
        required   : true,
        trim       : true,
        index      : {
            unique : true
        }
    },
    host: {
        type     : String,
        required : true,
        trim     : true
    },
    description: {
        type     : String,
        required : true,
        trim     : true
    },
    allows: {
        type     : [{
            type : String,
            enum : [
                'Youth',
                'Young Adult',
                'Young Chaperone',
                'Chaperone'
            ]
        }],
        required : true,
        default  : ['Youth', 'Young Adult', 'Young Chaperone']
    },
    category: {
        type     : String,
        enum     : [
            'Spiritual',
            'Emotional',
            'Mental',
            'Physical'
        ],
        required : true
    },
    tags: {
        type: [{
            type: String,
            trim: true
        }],
        required: false
    },
    _sessions: [{
        type: ObjectId,
        ref: 'Session'
    }]
});

/* Statics */

/* Methods */
WorkshopSchema.methods.permits = function allows(type) {
var self = this;
    if (self.allows.indexOf(type) == -1) {
        return false;
    } else {
        return true;
    }
};

/* Validators */

/* Middleware */
WorkshopSchema.pre('remove', function (next) {
    var Session = require('./Session');
    Session.find({_id: {$in: this._sessions}}).populate('_registered')
        .exec(function (err, sessions) {
            if (!err) {
                async.eachSeries(sessions, function iterator(session, cb) {
                    // The session will remove the members.
                    session.remove(cb);
                }, next);
            } else {
                next(err);
            }
        });
});

module.exports = mongoose.model('Workshop', WorkshopSchema);
