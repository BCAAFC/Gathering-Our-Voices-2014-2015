'use strict';

/* Imports */
var async    = require('async'),
    _        = require('lodash'),
    mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

var PaymentSchema = new Schema({
    date: {
        type    : Date,
        default : new Date()
    },
    number: {
        type     : String,
        required : false,
        default  : ""
    },
    amount: {
        type     : Number,
        required : true
    },
    type: {
        type     : String,
        required : true,
        enum     : [
            "Cheque",
            "Money Order",
            "Invoice",
            "Credit Card",
            "Paypal"
        ]
    },
    description: {
        // Additional Payment notes.
        type: String,
        trim: true
    },
    _group: {
        type     : ObjectId,
        ref      : 'Group',
        required : true
    }
});

/* Statics */

/* Methods */

/* Validators */

/* Middleware */
PaymentSchema.pre('save', function (next) {
    var self = this,
        Group = require('./Group');
    Group.findById(self._group).exec(function (err, group) {
        if (!err && group) {
            if (group._payments.indexOf(self._id) === -1) {
                // Not in the group.
                group._payments.push(self._id);
                group.save(next);
            } else {
                // Already in the group.
                next();
            }
        } else {
            next(err);
        }
    });
});

PaymentSchema.pre('remove', function (next) {
    var self = this,
        Group = require('./Group');
    Group.findById(self._group).exec(function (err, group) {
        if (!err && group) {
            var index = group._payments.indexOf(self._id);
            if (index !== -1) {
                group._payments.splice(index, 1);
                group.save(next); // err is usually null.
            } else {
                console.error('Tried to remove a payment that wasnt in the group... odd.');
                next();
            }
        } else {
            next(err || new Error('No group found.'));
        }
    });
});

module.exports = mongoose.model('Payment', PaymentSchema);
