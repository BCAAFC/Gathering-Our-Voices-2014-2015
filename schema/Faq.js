'use strict';

/* Imports */
var async = require('async'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

var FaqSchema = new Schema({
    title: {
        type     : String,
        required : true,
        trim     : true,
        index    : {
          unique : true
        }
    },
    prelude: {
        type     : String,
        required : false,
        trim     : true
    },
    items: {
        type: [{
          question: {
            type     : String,
            required : true,
            trim     : true,
          },
          answer: {
              type     : String,
              required : true,
              trim     : true
          }
        }],
        default: []
    }
});

/* Statics */

/* Methods */

/* Validators */

/* Middleware */
FaqSchema.pre('save', function sortItems(next) {
  var self = this;
  this.items.sort(function (a,b) {
    return a.title - b.title;
  });
  next();
});

module.exports = mongoose.model('Faq', FaqSchema);
