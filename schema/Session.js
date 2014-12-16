'use strict';

/* Imports */
var async    = require('async'),
    _        = require('lodash'),
    mongoose = require("mongoose"),
    bcrypt   = require("bcrypt"),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

/* Schema */
var SessionSchema = new Schema({
    start: {
        type     : Date,
        required : true
    },
    end: {
        type     : Date,
        required : true
    },
    room: {
        type     : String,
        required : true,
        trim     : true
    },
    venue: {
        type     : String,
        required : true,
        trim     : true
    },
    capacity: {
        type     : Number,
        min      : 0,
        max      : 2000,
        required : true
    },
    _workshop: {
        type     : ObjectId,
        ref      : 'Workshop',
        required : true
    },
    _registered: [{
        type: ObjectId,
        ref: 'Member'
    }],
    workshop: {
        type: ObjectId,
        ref: 'Workshop'
    }
});

/* Statics */

/* Methods */
SessionSchema.methods.register = function register(memberId, next) {
    var self = this;
    if (self.capacity > self._registered.length) {
        self.update({
            $push: {
                _registered: memberId
            }
        }, next);
    } else {
        next('Session full.');
    }
};

SessionSchema.methods.unregister = function unregister(memberId, next) {
    var self = this;
    self.update({
        $pull: {
            _registered: memberId
        }
    }, next);
};

SessionSchema.methods.conflicts = function conflicts(start, end) {
    var self = this;
    if (start < self.start && end < self.start) {
        // Starts before, ends before.
        return false;
    } else if (start > self.end && end > self.end) {
        // Starts after, ends after.
        return false;
    }
    // Must either:
    //    * Start before, and end after (conflicting)
    //    * Start after, and end before (impossible)
    //    * Start at the same time, ending whenever (conflicting)
    return true;
};

/* Validators */

/* Middleware */
SessionSchema.pre('remove', function (next) {
    var Member = require('./Member'),
        Group = require('./Group'),
        Workshop = require('./Workshop'),
        self = this;
    async.series([
        function membersRemove(callback) {
            // Remove all members.
            Member.find({_id: {$in: self._registered} }).exec(function (err, members) {
                if (!err) {
                    async.eachSeries(members, function iterator(member, cb) {
                        // The session is being removed, so we don't need to manipulate it.
                        member.removeWorkshop(self._id, function save(err, member) {
                            if (err) { cb(err, member); }
                            else { member.save(cb); }
                        });
                    }, callback);
                } else {
                    callback(err);
                }
            });
        },
        function workshopModify(callback) {
            // Remove the session from workshop.
            // Don't need to worry about middleware here.
            Workshop.findByIdAndUpdate(self._workshop, {
                $pull: {
                    _sessions: self._id
                }
            }, callback);
        }
    ], next);
});

module.exports = mongoose.model('Session', SessionSchema);
