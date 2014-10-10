'use strict';

/* Imports */
var async = require('async'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId,
    Payment  = require('./Payment'),
    Member   = require('./Member');

/* Vars */
var earlyTicket = 125,
    regularTicket = 175;

var GroupSchema = new Schema({
  email: {
    type: String,
    match: /.*@.*\..*/, // Most emails.
    trim: true,
    required: true,
    lowercase: true,
    index: {
      unique: true // No duplicates allowed.
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
    type: String,
    trim: true,
    required: true
  },
  affiliation: {
    type: String,
    trim: true,
    required: true,
    index: true
  },
  address: {
    type: String,
    trim: true,
    required: true
  },
  city: {
    type: String,
    trim: true,
    required: true
  },
  province: {
    type: String,
    trim: true,
    required: true,
    enum: [ // Must be one of these to work.
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
    type: String,
    trim: true,
    required: true
  },
  fax: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    required: true
  },
  region: {
    type: String,
    trim: true,
    required: true,
    enum: [
      "North",
      "Interior",
      "Fraser",
      "Vancouver Coastal",
      "Vancouver Island",
      "Out of Province"
    ]
  },
  affiliationType: {
    type: String,
    trim: true,
    required: true,
    enum: [
      "Friendship Centre",
      "Off-reserve",
      "On-reserve",
      "Other"
    ]
  },
  registrationDate: {
    type: Date,
    required: true,
    default: new Date()
  },
  youthInCare: {
    type: Number,
    default: 0,
    min: 0,
    max: 200
  },
  youthInCareSupport: {
    type: Number,
    default: 0,
    min: 0,
    max: 200
  },
  // Private things
  _notes: {
    type: String,
    trim: true
  },
  _state: {
    tags: {
      type: [{
        type: String,
        trim: true,
        default: ''
      }],
      default: []
    },
    steps: {
      conduct: {
        type: Boolean,
        default: false
      },
      details: {
        type: Boolean,
        default: false
      },
      members: {
        type: Boolean,
        default: false
      },
      documents: {
        type: Boolean,
        default: false
      },
      payments: {
        type: Boolean,
        default: false
      },
      workshops: {
        type: Boolean,
        default: false
      },
      checkin: {
        type: Boolean,
        default: false
      }
    }
  },
  _members: { // List of members.
    type: [{
      type: ObjectId,
      ref: 'Member'
    }],
    default: []
  },
  _payments: { // List of payments.
    type: [{
      type: ObjectId,
      ref: 'Payment'
    }],
    default: []
  }
});

/* Statics */
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

GroupSchema.methods.getPaid = function getPaid(next) {
  var self = this;
  Payment.find({_id: {$in: self._payments }}).exec(function (err, payments) {
    if (!err) { // Its'ok if payments is []
      var sum = _.reduce(payments, function (sum, payment) {
        return sum + payment.amount;
      }, 0);
      next(null, sum);
    } else {
      next(err);
    }
  });
};

GroupSchema.methods.getCost = function getCost(next) {
  var self = this;
  Member.find({_id: {$in: self._members }}).exec(function (err, members) {
    if (!err) { // Its'ok if members is []
      var due = _.reduce(members, function (sum, member) {
        if (member._state.ticketType === 'Early') {
          return sum + earlyTicket;
        } else {
          return sum + regularTicket;
        }
      }, 0);
      next(null, due);
    } else {
      next(err);
    }
  });
};

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

GroupSchema.methods.isAdmin = function () {
  var self = this;
  return (process.env.ADMINS.indexOf(self.email) != -1);
};

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
          'Youth': 0,
          'Young Adult': 0,
          'Chaperone': 0,
          'Young Chaperone': 0
        });
        var youth = vals.Youth,
            chaperones = (vals.Chaperone + vals['Young Chaperone']) * 5;
        next(null, chaperones > youth);
      } else {
        next(err, false);
      }
    });
};

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
GroupSchema.pre('validate', function (next) {
  var self = this;
  if (self.password) {
    bcrypt.hash(self.password, 10, function (err, hash) {
      if (!err) {
        self.hash = hash;
        self.password = null;
        next();
      } else {
        next(err);
      }
    });
  } else {
    next();
  }
});

GroupSchema.pre('remove', function (next) {
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
