'use strict';

var async = require('async'),
    _ = require('lodash');

module.exports = function(data) {
    var router = require('express').Router(),
        Group = require('../schema/Group'),
        Workshop = require('../schema/Workshop'),
        util = require('./util');

    router.get('/workshops', function (req, res) {
      // Handle query strings.
      var query = {};
      if (req.query.sessions) {
        query['sessions.session'] = {$in: req.query.sessions.split(',').map(function (val) { return Number(val); })};
      }
      if (req.query.query) {
        query.description = new RegExp(req.query.query, 'i');
      }
      // Build output.
      Workshop.model.find(query).sort('name').exec(function (err, workshops) {
        if (!err) {
          res.render('workshops', {
            title: 'Workshops',
            session: req.session,
            workshops: workshops || {}
          });
        } else {
          res.send('There was a strange error. Please go back and try again.');
          console.error(err);
        }
      });
    });

    router.get('/workshop/:id', function (req, res) {
      Workshop.model.findById(req.params.id).exec(function (err, workshop) {
        if (!err && workshop) {
          res.render('workshop', {
            title: "Workshop Details",
            session: req.session,
            workshop: workshop
          });
        } else {
          res.send('There was an error or we weren\'t able to find that workshop. Try again?');
          console.error(err);
        }
      });
    });

    router.get('/workshop/members/:id/:session', util.auth, function (req, res) {
      if (req.session.isAdmin) {
        // Admins can see all members in the workshop.
        async.auto({
          workshop: Workshop.model.findById(req.params.id).populate("sessions._registered").exec,
          group: Group.model.findById(req.session.group._id).populate("_members").exec
        }, function complete(err, data) {
          if (!err && data.group && data.workshop) {
            res.render('templates/workshopMembers', {
              session: {group: data.group, isAdmin: req.session.isAdmin},
              workshops: data.workshop,
              workshopSession: Number(req.params.session),
              message: req.query.message || null
            });
          } else {
            res.send('There was an error, please try again.');
            console.error(err);
          }
        });
      } else {
        // Normal users can only see their group
        async.auto({
          workshop: Workshop.model.findById(req.params.id).exec,
          group: Group.model.findById(req.session.group._id).populate("_members").exec
        }, function complete(err, data) {
          if (!err && data.workshop && data.group) {
            res.render('templates/workshopMembers', {
              session: {group: data.group},
              workshop: data.workshop,
              workshopSession: Number(req.params.session),
              message: req.query.message || null
            });
          } else {
            res.send('There was an error, please try again.');
            console.error(err);
          }
        });
      }
    });

    /**
     * Transforms a choice into an array of types that can sign up.
     */
    function allowsTransformer(val) {
      switch (val) {
        case 'default':
          return ["Youth", "Young Adult", "Young Chaperone"];
        case 'all':
          return ["Youth", "Young Adult", "Young Chaperone", "Chaperone"];
        case 'chaperones':
          return ["Young Chaperone", "Chaperone"];
        case 'young':
          return ["Youth", "Young Adult"];
        case 'youngAdult':
          return ["Young Adult"];
        case 'youth':
          return ["Youth"];
      }

    }

    router.route('/workshop')
      .get(util.admin, function (req, res) {
        if (req.query.id) {
          Workshop.model.findById(req.query.id).exec(function (err, workshop) {
            if (!err && workshop) {
              res.render('templates/workshopForm', {
                session: req.session,
                workshop: workshop
              });
            } else {
              res.send('There was an error getting that workshop. Try again?');
              console.error(err);
            }
          });
        }
      })
      .post(util.admin, function (req, res) {
        Workshop.create({
          name: req.body.name,
          host: req.body.host,
          description: req.body.description,
          label: req.body.label,
          allows: allowsTransformer(req.body.allows),
          sessions: _(_.range(0, 13+1)).map(function (val) {
            if (req.body.enabled[val] == 'on') {
              return {
                session: val,
                room: req.body.room[val],
                venue: req.body.venue[val],
                capacity: req.body.capacity[val]
              };
            } // Else nothing.
          })
        }, function (err, workshop) {
          if (err) {
            res.redirect('/workshops?message=' + JSON.stringify(err));
          } else {
            res.redirect('/workshops');
          }
        });
      })
      .put(util.admin, function (req, res) {
        Workshop.model.findById(req.body.id).exec(function (err, workshop) {
          if (!err && workshop) {
            workshop.name = req.body.name;
            workshop.host = req.body.host;
            workshop.description = req.body.description;
            workshop.label = req.body.label;
            workshop.allows = allowsTransformer(req.body.allows);
            workshop.sessions = _(_.range(0, 13+1)).map(function (val) {
              var session = workshop.session(val);
              if (req.body.enabled[val] == 'on') {
                if (session) {
                  // The session exists already, edit it.
                  session.room = req.body.room[val];
                  session.venue = req.body.venue[val];
                  session.capacity = req.body.capacity[val];
                } else {
                  // The session does not exist.
                  workshop.sessions.push({
                    session: val,
                    room: req.body.room[val],
                    venue: req.body.venue[val],
                    capacity: req.body.capacity[val]
                  });
                }
              } else {
                if (session) {
                  // The session needs to be removed.
                  // TODO
                  console.error('The session needs to be removed, but that is not implemented yet.');
                }
              }
            });
            workshop.save(function (err) {
              if (!err) {
                res.redirect('/workshops');
              } else {
                res.send('There was an error doing that, try again?');
                console.error(err);
              }
            });
          } else {
            res.send('There was an error making that change. Try again?');
            console.error(err);
          }
        });
      });

    router.delete('/workshop/delete/:id', util.admin, function (req, res) {
      Workshop.model.findById(req.params.id).exec(function (err, workshop) {
        if (!err && workshop) {
          workshop.remove(function (err) {
            if (!err) {
              res.redirect('/workshops?message=Workshop deleted!');
            } else {
              res.redirect('/workshops?message=Workshop not deleted!');
              console.error(err);
            }
          });
        } else {
          res.redirect('/workshops?message=Could not find workshop!');
          console.error(err);
        }
      });
    });

    return router;
};
