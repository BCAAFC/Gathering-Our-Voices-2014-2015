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

/* Vars */
var EARLY_TICKET   = 125,
    REGULAR_TICKET = 175;

var GroupSchema = new Schema({
    email: {
        type       : String,
        match      : /.*@.*\..*/, // Most emails.
        trim       : true,
        required   : true,
        lowercase  : true,
        index      : {
            unique : true // No duplicates allowed.
        }
    },
    hash: {
        type: String
    },
    password: { // NOTE: This isn't stored, it exists for our validation hook.
        type: String,
        trim: true
    },
    name: {
        type     : String,
        trim     : true,
        required : true
    },
    affiliation: {
        type     : String,
        trim     : true,
        required : true,
        index    : true
    },
    address: {
        type     : String,
        trim     : true,
        required : true
    },
    city: {
        type     : String,
        trim     : true,
        required : true
    },
    province: {
        type     : String,
        trim     : true,
        required : true,
        enum     : [ // Must be one of these to work.
            "British Columbia",
            "Alberta",
            "Saskatchewan",
            "Manitoba",
            "Ontario",
            "Quebec",
            "New Brunswick",
            "Nova Scotia",
            "Prince Edward Island",
            "Newfoundland and Labrador",
            "Nunavut",
            "Northwest Territories",
            "Yukon",
            "Other (Outside Canada)"
        ]
    },
    postalCode: {
        type     : String,
        trim     : true,
        required : true
    },
    fax: {
        type: String,
        trim: true
    },
    phone: {
        type     : String,
        trim     : true,
        required : true
    },
    region: {
        type     : String,
        trim     : true,
        required : true,
        enum     : [
            "North",
            "Interior",
            "Fraser",
            "Vancouver Coastal",
            "Vancouver Island",
            "Out of Province"
        ]
    },
    affiliationType: {
        type     : String,
        trim     : true,
        required : true,
        enum     : [
            "Friendship Centre",
            "Off-reserve",
            "On-reserve",
            "Other"
        ]
    },
    registrationDate: {
        type     : Date,
        required : true,
        default  : new Date()
    },
    youthInCare: {
        type    : Number,
        default : 0,
        min     : 0,
        max     : 200
    },
    youthInCareSupport: {
        type    : Number,
        default : 0,
        min     : 0,
        max     : 200
    },
    // Private things
    _notes: {
        type: String,
        trim: true
    },
    _state: {
        tags: {
            type: [{
                type    : String,
                trim    : true,
                default : ''
            }],
            default: []
        },
        balance: {
            cost: {
                type: Number,
                default: 0
            },
            paid: {
                type: Number,
                default: 0
            }
        },
        steps: {
            conduct: {
                type    : Boolean,
                default : false
            },
            details: {
                type    : Boolean,
                default : false
            },
            youthInCare: {
                type    : Boolean,
                default : false
            },
            members: {
                type    : Boolean,
                default : false
            },
            documents: {
                type    : Boolean,
                default : false
            },
            payments: {
                type    : Boolean,
                default : false
            },
            workshops: {
                type    : Boolean,
                default : false
            },
            checkin: {
                type    : Boolean,
                default : false
            }
        }
    },
    _members: { // List of members.
        type: [{
            type : ObjectId,
            ref  : 'Member'
        }],
        default: []
    },
    _payments: { // List of payments.
        type: [{
            type : ObjectId,
            ref  : 'Payment'
        }],
        default: []
    }
});

/* Statics */

/**
 * Logs a group into the site by setting their `req.session.group`
 * @param  {String}   email    The primary contact's email.
 * @param  {String}   password The password to check against the hash.
 * @param  {Function} next     The callback.
 */
GroupSchema.statics.login = function login(email, password, next) {
    var self = this;
    self.findOne({email: email}).exec(function (err, group) {
        if (!err && group) {
            // Check the password.
            bcrypt.compare(password, group.hash, function (err, valid) {
                if (!err && valid) {
                    next(null, group);
                } else {
                    next(err || new Error('Wrong Password'), null);
                }
            });
        } else {
            next(err || new Error('No group found.'), null);
        }
    });
};

/* Methods */

/**
 * Adds a member to the group if they're not already in it.
 * @param {ObjectId} memberId The member's ID.
 * @param {Function} next     The callback
 */
GroupSchema.methods.addMember = function addMember(memberId, next) {
    var self = this;
    if (self._members.indexOf(memberId) === -1) {
        // Not already in.
        self._members.push(memberId);
        self.save(next);
    } else {
        // Already in the group!
        console.error('Tried to add ' + memberId + ' to group ' + self._id + ' but already in it.');
        next(new Error('Tried to add ' + memberId + ' to group ' + self._id + ' but already in it.'));
    }
};

/**
 * Calculates the groups total paid amount by looking at their payments.
 * @param {Function} next The callback.
 */
GroupSchema.methods.getPaid = function getPaid(next) {
    var self = this;
    Payment.find({_id: {$in: self._payments }}).exec(function (err, payments) {
        if (!err) { // Its'ok if payments is []
            var sum = _.reduce(payments, function (sum, payment) {
                return sum + payment.amount;
            }, 0);
            self._state.balance.paid = sum; // Not saved. Save in your function.
            next(null, sum);
        } else {
            next(err);
        }
    });
};

/**
 * Calculates the groups total costs by looking at their members.
 * @param {Function} next The callback.
 */
GroupSchema.methods.getCost = function getCost(next) {
    var self = this;
    Member.find({_id: {$in: self._members }}).exec(function (err, members) {
        if (!err) { // Its'ok if members is []
            // Count number of early and regular tickets.
            var counts = _.reduce(members, function (sum, member) {
                sum[member._state.ticketType] += 1;
                return sum;
            }, {'Early': 0, 'Regular': 0});
            // Figure out how many are free.
            var free = Math.floor((counts.Early + counts.Regular) / 6),
                newFree = 0,
                old = 0;
            // Decrement the counts by the number of free.
            // Do regular tickets first.
            if (free >= counts.Regular) { // More free then regular tickets.
                old = counts.Regular;
                counts.Regular = 0;
                free = free - old; // Used them all.
            } else { // free < counts.Regular
                newFree = free - counts.Regular; // Remaining free will roll over.
                counts.Regular -= free;
                free = newFree; // The remaining free... To be used against Early tickets.
            }
            // Then Early tickets as the remainder.
            if (free >= counts.Early) {
                old = counts.Free;
                counts.Early = 0;
                free = free - old; // Used them all.
            } else { // free < counts.Early
                newFree = free - counts.Early;
                counts.Early -= free;
                free = newFree;
            }
            // Get the due value.
            var due = (counts.Early * EARLY_TICKET) + (counts.Regular * REGULAR_TICKET);
            self._state.balance.cost = due; // Not saved. Save in your function.
            next(null, due);
        } else {
            next(err);
        }
    });
};

/**
 * Calculates the groups balance by calling the `getCost` and `getPaid`.
 * @param {Function} next The callback. (err, balance)
 */
GroupSchema.methods.getBalance = function getBalance(next) {
    var self = this;
    self.getCost(function (err, cost) {
        self.getPaid(function (err, paid) {
            if (!err && cost && paid) {
                next(null, cost-paid);
            } else {
                next(err, null);
            }
        });
    });
};

/**
 * Determines if the group is an administrator.
 * @return {Boolean} `true` if they are, `false` if they are not.
 */
GroupSchema.methods.isAdmin = function () {
    var self = this;
    return (process.env.ADMINS.indexOf(self.email) != -1);
};

/**
 * Determines if the group has enough chaperones in it.
 * @param {Function} next The callback.
 */
GroupSchema.methods.enoughChaperones = function (next) {
    var self = this;
    Member.find({_id: {$in: self._members}})
        .select('type')
        .exec(function (err, members) {
            if (!err && members) {
                var vals = _.reduce(members, function reducer(sum, member) {
                    sum[member.type] += 1;
                    return sum;
                }, {
                    'Youth'           : 0,
                    'Young Adult'     : 0,
                    'Chaperone'       : 0,
                    'Young Chaperone' : 0
                });
                // 5 youth under 1 chaperone
                var youth      = vals.Youth,
                    chaperones = (vals.Chaperone + vals['Young Chaperone']) * 5;
                next(null, chaperones >= youth);
            } else {
                next(err, false);
            }
        });
};

/**
 * Detemines if all the groups members are completed.
 * @param {Function} next The callback.
 */
GroupSchema.methods.allComplete = function allComplete(next) {
    var self = this;
    Member.find({_id: {$in: self._members}})
        .select('_state.complete')
        .exec(function (err, members) {
            if (!err && members) {
                next(null, _.every(members, function (member) {
                    return member._state.complete;
                }));
            } else {
                next(err, false);
            }
        });
};

/* Validators */

/* Middleware */

/**
 * Hashes the password and removes the plaintext.
 * @param {Function} next The callback.
 */
GroupSchema.pre('validate', function hashPassword(next) {
    var self = this;
    if (self.password) {
        bcrypt.hash(self.password, 10, function (err, hash) {
            if (!err) {
                self.hash     = hash;
                self.password = null; // This is important.
                next();
            } else {
                next(err);
            }
        });
    } else {
        next();
    }
});

/**
 * Appropriately removes all the members and payments of the group one by one.
 */
GroupSchema.pre('remove', function removeGroup(next) {
    var self = this;
    // Note: We can't just `Member.remove ...` because middleware needs to happen on them.
    async.auto({
        members: function (cb) {
            Member.find({_id: {$in: self._members}}).exec(cb);
        },
        payments: function (cb) {
            Payment.find({_id: {$in: self._payments}}).exec(cb);
        },
        removeMembers: ['members', function (cb, data) {
            async.map(data.members, function (member, callback) {
                member.remove(callback);
            }, cb);
        }],
        removePayments: ['payments', function (cb, data) {
            async.map(data.payments, function (payment, callback) {
                payment.remove(callback);
            }, cb);
        }]
    }, next);
});

module.exports = mongoose.model('Group', GroupSchema);
