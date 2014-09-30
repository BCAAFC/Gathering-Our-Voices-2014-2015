'use strict';

var async = require('async'),
    _ = require('lodash');

module.exports = function(data) {
  var router = require('express').Router(),
      Group = require('../schema/Group'),
      Payment = require('../schema/Payment'),
      util = require('./util');

  router.get('/payments', util.auth, function (req, res) {
    Group.model.findById(req.session.group._id)
      .populate('_payments')
      .exec(function (err, group) {
        if (!err && group) {
          async.auto({
            paid: group.getPaid.bind(group),
            cost: group.getCost.bind(group)
          }, function complete(err, data) {
            if (!err && data.paid !== null && data.cost !== null) {
              res.render('payments', {
                title: 'Payments',
                session: req.session,
                group: group,
                cost: data.cost,
                paid: data.paid
              });
            } else {
              res.send('Sorry, there was an error, please try again.');
              console.error(err);
            }
          });
        } else {
          res.send('Sorry, there was an error finding your group. Try again?');
          console.error(err);
        }
      });
  });

  router.post('/payment', util.admin, function (req, res) {
    Payment.model.create({
      amount:      req.body.amount,
      type:        req.body.type,
      number:      req.body.number,
      description: req.body.description,
      date: {
        day:       req.body.day,
        month:     req.body.month,
        year:      req.body.year
      },
      _group:      req.session.group._id
    }, function (err, payment) {
      // The Schema ensures that the payment is in the group already.
      if (!err && payment) {
        res.redirect('/account');
      } else {
        var message = "Something didn't work out. Try again?";
        res.redirect('/account?message=' + message);
        console.error(err);
      }
    });
  });

  router.get('/payment/delete/:id', util.admin, function (req, res) {
    Payment.model.findById(req.params.id).exec(function (err, payment) {
      if (!err && payment) {
        payment.remove(function (err) {
          if (err) {
            res.redirect('/account?message=' + err);
          } else {
            Group.model.findByIdAndUpdate(payment._group, {
              $set: {
                '_state.steps.payments': false
              }
            }).exec(function (err, group) {
              req.session.group = group;
              res.redirect('/account');
            });
          }
        });
      } else {
        res.redirect('/account?message=' + err);
      }
    });
  });

  return router;
};
