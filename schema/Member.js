'use strict';

/* Imports */
var async = require('async'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId,
    Session = require('./Session');

var MemberSchema = new Schema({
  // Members aren't required to immediately have all their information.
  name: {
    type: String,
    trim: true,
    required: true
  },
  type: {
    type: String,
    // Must account for the 'null' case.
    enum: ['Youth', 'Young Adult', 'Chaperone', 'Young Chaperone'],
    required: true
  },
  gender: {
    type: String,
    enum: ['', 'Male', 'Female', 'Other'],
    default: ''
  },
  birthDate: {
    day: {
      type: Number,
      min: 1,
      max: 31,
      default: null
    },
    month: {
      type: String,
      enum: [
        '',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      default: ''
    },
    year: {
      type: Number,
      min: 1900,
      max: 2001,
      default: null
    }
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    match: /.*@.*\..*/,
    trim: true,
    lowercase: true,
    default: ''
  },
  // Emergency Contact Info, Unlikely to be used but important!
  emergencyContact: {
    name: {
      type: String,
      trim: true,
      default: ""
    },
    relation: {
      type: String,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    }
  },
  emergencyInfo: {
    medicalNum: {
      type: String,
      trim: true,
      default: ""
    },
    allergies: {
      type: [String], // Needs to be parsed out.
      default: [""]
    },
    conditions: {
      type: [String], // Needs to be parsed out.
      default: [""]
    }
  },
  _state: {
    // Checked via middlewares.
    complete: {
      type: Boolean,
      default: false
    },
    ticketType: {
      type: String,
      default: 'Regular',
      enum: ['Early', 'Regular']
    },
    registrationDate: {
      type: Date,
      default: Date.now
    }
  },
  _workshops: {
    type: [{
      type: ObjectId,
      ref: 'session' // Sessions of workshops.
    }],
    default: []
  },
  _group: {
    type: ObjectId,
    ref: 'Group',
    required: true
  }
});


/* Statics */

/* Methods */
MemberSchema.methods.hasConflicts = function hasConflicts(start, end, next) {
  var self = this;
  Session.find({_id: {$in: self._workshops}}).exec(function (err, sessions) {
    if (!err) {
      var conflict = _.some(sessions, function (session) {
        return session.conflicts(start, end);
      });
      if (conflict) {
        next("Session " + conflict + " conflicts.", conflict);
      } else {
        next(null, conflict);
      }
    } else {
      next(err, null);
    }
  });
};

MemberSchema.methods.addWorkshop = function addWorkshop(sessionId, next) {
  var self = this;
  async.auto({
    session: Session.findById(sessionId).populate('_workshop').exec,
    conflicts: ['session', function conflicts(cb, data) {
      self.hasConflicts(data.session.start, data.session.end, cb);
    }],
    allows: ['session', function allows(cb, data) {
      if (data.session._workshop.permits(self.type)) {
        cb(null);
      } else {
        cb('Workshop does not allow that member type.');
      }
    }],
    registerSession: ['conflicts', 'allows', function session(cb) {
      session.register(self._id, cb);
    }],
    registerMember: ['registerSession', function member(cb) {
      self.update({
        $push: {
          _workshops: sessionId
        }
      }, cb);
    }]
  }, next);
};

MemberSchema.methods.removeWorkshop = function removeWorkshop(sessionId, next) {
  var self = this;
  async.series([
    function unregisterSession(cb) {
      Session.findByIdAndUpdate(sessionId, {
        $pull: {
          _registered: self._id
        }
      }, cb);
    },
    function unregisterMember(cb) {
      self.update({
        $pull: {
          _workshops: sessionId
        }
      }, cb);
    }
  ], next);
};

/* Validators */

/* Middleware */
MemberSchema.pre('save', function (next) {
  var self = this;
  // Is the Member Complete?
  if (self.type === '') { self._state.complete = false; }
  else if (self.gender === '') { self._state.complete = false; }
  else if (self.phone === '') { self._state.complete = false; }
  else if (self.birthDate.day === '') { self._state.complete = false; }
  else if (self.birthDate.month === '') { self._state.complete = false; }
  else if (self.birthDate.year === '') { self._state.complete = false; }
  else if (self.emergencyContact.name === '') { self._state.complete = false; }
  else if (self.emergencyContact.relation === '') { self._state.complete = false; }
  else if (self.emergencyContact.phone === '') { self._state.complete = false; }
  else if (self.emergencyInfo.medicalNum === '') { self._state.complete = false; }
  else { self._state.complete = true; }

  // Ticket Type
  if (self._state.registrationDate < new Date('Feb 7, 2015')) {
    self._state.ticketType = 'Early';
  }

  // Old enough to actually be a chaperone if they are?
  if (self.type === "Chaperone" && (self.birthDate.year && self.birthDate.year > (2014-21))) {
    next(new Error("Chaperone not old enough"));
  }

  // Is the member in the group?
  if (self._group) {
    var Group = require('./Group');
    Group.findById(self._group).exec(function (err, group) {
      if (group._members.indexOf(self._id) == -1) {
        group._members.push(self._id);
        group.save(next);
      } else {
        next();
      }
    });
  } else {
    // No group, will error out later.
    next();
  }
});

MemberSchema.pre('remove', function (next) {
  var Group = require('./Group');
  var self = this;
  async.series([
    function group(cb) {
      Group.findByIdAndUpdate(self._group, {
        $pull: {
          _members: self._id
        }
      }, cb);
    },
    function session(cb) {
      // Remove all instances of this person in sessions.
      Session.update({_registered: self._id}, {
        $pull: {
          _registered: self._id
        }
      }, {multi: true}, cb);
    }
  ], next);
});

module.exports = mongoose.model('Member', MemberSchema);
