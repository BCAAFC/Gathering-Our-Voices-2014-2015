'use strict';

var async = require('async'),
    _ = require('lodash');

module.exports = function(data) {
  var router = require('express').Router(),
      Group = require('../schema/Group'),
      util = require('./util');

  router.route('/register')
    .get(function (req, res) {
      res.render('register', {
        title: 'Register or Log In',
        session: req.session
      });
    }).post(function (req, res) {
      if (req.body.passwordConfirm && req.body.passwordConfirm === req.body.password) {
        Group.model.create({
          email:           req.body.email,
          password:        req.body.password,
          name:            req.body.name,
          affiliation:     req.body.affiliation,
          address:         req.body.address,
          city:            req.body.city,
          region:          req.body.region,
          province:        req.body.province,
          postalCode:      req.body.postalCode,
          fax:             req.body.fax,
          phone:           req.body.phone,
          affiliationType: req.body.affiliationType
        }, function (err, group) {
          if (!err) {
            // TODO: Mail message.
            req.session.group = group;
            res.redirect('/account');
          } else if (err) {
            var message;
            if (err.code === 11000) {
              message = "That email is already registered. Tried logging in?";
            } else {
              message = "You either missed a field required (Marked with a *), or there was an error.";
            }
            res.redirect("/register?message=" + message); // TODO: URL Encode
          }
        });
      } else {
        var message = "The passwords did not match.";
        res.redirect('/register?message=' + message);
      }
    });

  router.post('/login', function (req, res) {
    Group.model.login(req.body.email, req.body.password, function (err, group) {
      if (!err && group) {
        req.session.isAdmin = group.isAdmin();
        req.session.group = group;
        res.redirect('/account');
      } else {
        var message = "The login details are incorrect, please double check them.";
        res.redirect('/register?message=' + message);
      }
    });
  });

  router.get('/logout', util.auth, function (req, res) {
    req.session.regenerate(function () {
      res.redirect('/');
    });
  });

  router.get('/conduct/agree', util.auth, function (req, res) {
    Group.model.findById(req.session.group._id).exec(function (err, group) {
      if (err) {
        res.send('Sorry, there was an error finding your group. Try again?');
        console.error(err);
      } else {
        group._state.agreedToConduct = true;
        group.save(function (err) {
          if (err) {
            res.send('Sorry, there was an error saving your group. Try again?');
            console.error(err);
          } else {
            req.session.group = group;
            res.redirect('/account');
          }
        });
      }
    });
  });

  router.post('/printout', util.auth, function (req, res) {
    Group.model.findById(req.session.group._id)
      .populate('_members').populate('_payments')
      .exec(function (err, group) {
        if (!err && group) {
          async.auto({
            cost: group.getCost.bind(group),
            paid: group.getPaid.bind(group)
          }, function complete(err, data) {
            if (err) {
              res.send('Sorry, there was an error getting payment details your group. Try again?');
              console.error(err);
            }
            group.stats = _.reduce(group._members, function (sum, val) {
              sum[val.type][val._state.ticketType] += 1;
              return sum;
            }, {
              '': {'Early': 0, 'Regular': 0},
              'Youth': {'Early': 0, 'Regular': 0},
              'Young Adult': {'Early': 0, 'Regular': 0},
              'Young Chaperone': {'Early': 0, 'Regular': 0},
              'Chaperone': {'Early': 0, 'Regular': 0}
            });
            res.render('printout', {
              title: 'Printout',
              session: req.session,
              group:   group,
              cost:    data.cost,
              paid:    data.paid
            });
          });
        } else {
          res.send('Sorry, there was an error finding your group. Try again?');
          console.error(err);
        }
      });
  });

  router.get('/recover/:email', function (req, res) {
    Group.model.findOne({email: req.params.email}, function (err, group) {
      if (!err && group) {
        var hash = Math.random().toString(36).slice(2);
        data.redis.set(hash, group._id, function (err, redisResponse) {
          // TODO
          console.error('Not implemented yet!');
        });
      } else {
        res.send('Sorry, there was an error finding your group. Try again?');
        console.error(err);
      }
    });
  });

  router.get('/recovery/:hash', function (req, res) {
    data.redis.get(req.params.hash, function (err, response) {
      data.redis.del(req.params.hash);
      if (err || !response) {
        Group.model.findById(response).exec(function (err, group) {
          if (!err && group) {
            req.session.group = group;
            res.redirect('/account');
          } else {
            res.send('Sorry, there was an error finding your group. Try again?');
            console.error(err);
          }
        });
      }
    });
  });

  router.route('/account')
    .get(util.auth, function (req, res) {
      Group.model.findById(req.session.group._id)
        .populate("_members")
        .exec(function (err, group) {
          if (!err && group) {
            if (group._state.agreedToConduct === false) {
              res.redirect('/conduct');
            } else {
              res.render('account', {
                session: req.session,
                title: 'Account',
                members: group._members
              });
            }
          } else {
            res.send('Sorry, there was an error finding your group. Try again?');
            console.error(err);
          }
        });
    })
    .put(util.auth, function (req, res) {
      Group.model.findById(req.session.group._id).exec(function (err, group) {
        if (!err && group) {
          group.email =           req.body.email;
          group.password =        req.body.password;
          group.name =            req.body.name;
          group.affiliation =     req.body.affiliation;
          group.address =         req.body.address;
          group.city =            req.body.city;
          group.region =          req.body.region;
          group.province =        req.body.province;
          group.postalCode =      req.body.postalCode;
          group.fax =             req.body.fax;
          group.phone =           req.body.phone;
          group.affiliationType = req.body.affiliationType;
          group.youthInCare =     Number(req.body.youthInCare);
          group.youthInCareSupport = Number(req.body.youthInCareSupport);
          group.save(function (err, group) {
            if (err) {
              res.send('Sorry, there was an error saving your group. Try again?');
              console.error(err);
            } else {
              req.session.group = group;
              res.redirect('/account');
            }
          });
        } else {
          res.send('Sorry, there was an error finding your group. Try again?');
          console.error(err);
        }
      });
    });

  // TODO: ADMIN
  router.get('/checkin/:id', util.admin, function (req, res) {
    throw new Error('Deprecated');
  });
  router.get('/account/:id', util.admin, function (req, res) {
    throw new Error('Deprecated');
  });

  return router;
};
