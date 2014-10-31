'use strict';

var async = require('async'),
    _     = require('lodash');

module.exports = function(data) {
    var router = require('express').Router(),
        Group  = require('../schema/Group'),
        Member = require('../schema/Member'),
        News   = require('../schema/News'),
        Faq    = require('../schema/Faq'),
        util   = require('./util');

    router.get('/admin', util.admin, function (req, res) {
        // TODO: Searching for a member.
        Group.find().sort('affiliation').exec(function (err, groups) {
            if (!err) {
                res.render('admin', {
                    title   : 'Administration',
                    session : req.session,
                    groups  : groups
                });
            } else {
                res.send('Sorry, something went wrong. Try again?');
                console.error(err);
            }
        });
    });

    router.get('/facilitators', util.admin, function (req, res) {
        var Facilitator = require('../schema/Facilitator');
        Facilitator.find({}).exec(function (err, facilitators) {
            res.render('facilitator-list', {
                title        : 'Facilitator List',
                session      : req.session,
                facilitators : facilitators
            });
        });
    });

    router.get('/manage/:id', util.admin, function (req, res) {
        Group.findById(req.params.id).exec(function (err, group) {
            if (!err && group) {
                // Maintain administrator status.
                req.session.group = group;
                res.redirect('/account');
            } else {
                res.send('There was an error, or there is no such group.');
                console.error(err);
            }
        });
    });

    router.route('/notes/:id')
        .get(util.admin, function (req, res) {
            Group.findById(req.params.id).exec(function (err, group) {
                if (!err && group) {
                    res.render('notes', {
                        title   : 'Group Notes',
                        session : req.session,
                        group   : group
                    });
                } else {
                    res.send('There was an error, or there is no such group.');
                    console.error(err);
                }
            });
        }).put(util.admin, function (req, res) {
            Group.findById(req.params.id).exec(function (err, group) {
                if (!err && group) {
                    group._notes      = req.body.notes;
                    group._state.tags = req.body.tags.split(',').sort();
                    group.save(function (err) {
                        if (!err) {
                            res.redirect('/notes/' + group._id);
                        } else {
                            res.send('There was an error saving the group.');
                            console.error(err);
                        }
                    });
                } else {
                    res.send('There was an error, or there is no such group.');
                    console.error(err);
                }
            });
        });

    router.get('/statistics', util.admin, function (req, res) {
        async.auto({
            groups  : groups,
            members : members
        }, function complete(err, data) {
            console.log(data.groups);
            res.render('statistics', {
                title                   : 'Statistics',
                session                 : req.session,
                types                   : data.members.types,
                ages                    : data.members.ages,
                regions                 : data.members.regions,
                totals                  : data.members.totals,
                dates                   : data.members.dates,
                youthInCareCount        : data.groups.youthInCare,
                youthInCareSupportCount : data.groups.youthInCareSupport
            });
        });
        function groups(callback) {
            Group.find({}).select('youthInCare youthInCareSupport region')
                .exec(function (err, groups) {
                    console.log(groups);
                    var result = _.reduce(groups, function (sum, group) {
                        // Need Youth In Care Feat Counts
                        sum.youthInCare += group.youthInCare;
                        sum.youthInCareSupport += group.youthInCareSupport;
                        return sum;
                    }, {youthInCare: 0, youthInCareSupport: 0});
                    console.log(result);
                    callback(null, result);
                });
        }
        function members(callback) {
            var startDate = new Date('Sept 01 2014'),
                    stopDate = new Date('Mar 21 2015');
            Member.find({}).populate('_group').exec(function (err, members) {
                // Cleverness below!
                var ages = _.range(14, 24+1).concat(['over', '']),
                        regions = ['North', 'Fraser', 'Interior', 'Vancouver Coastal',
                                             'Vancouver Island', 'Out of Province'],
                        types = ['Youth', 'Young Adult', 'Young Chaperone', 'Chaperone', ''],
                        dates = (function () {
                            var oneDay = 24*60*60*1000, // hours*minutes*seconds*milliseconds
                                    numDays = Math.round(Math.abs((startDate.getTime() - stopDate.getTime())/(oneDay)));
                            return Array.apply(null, new Array(numDays)).map(Number.prototype.valueOf, 0);
                        })();
                function buildEmpties(array) {
                    return _(array).map(function (val) {
                        return [val, {Male: 0, Female: 0, Other: 0, '': 0}];
                    }).zipObject().value();
                }
                var summation = {
                    types   : buildEmpties(types),
                    regions : buildEmpties(regions),
                    ages    : buildEmpties(ages),
                    dates   : dates,
                    totals  : {Male: 0, Female: 0, Other: 0, '': 0}
                };
                var result = _.reduce(members, function (sum, val) {
                    // Type
                    summation.types[val.type][val.gender] += 1;
                    // Age
                    if (val.birthDate.year) {
                        var the_age = (val.birthDate.year - 2015)*(-1);
                        if (the_age <= 24) {
                            summation.ages[the_age][val.gender] += 1;
                        } else {
                            summation.ages.over[val.gender] +=1;
                        }
                    } else {
                        summation.ages[''][val.gender] += 1;
                    }
                    // Region
                    summation.regions[val._group.region][val.gender] += 1;
                    // Totals
                    summation.totals[val.gender] += 1;
                    // Dates
                    var normalized = Date.parse(val._state.registrationDate) - startDate;
                    normalized = normalized / (24*60*60*1000); // One day
                    normalized = Math.floor(normalized);
                    summation.dates[normalized] += 1;
                    // Must return summation.
                    return summation;
                }, summation);
                callback(null, result);
            });
        }
    });

    router.get('/emails', util.admin, function (req, res) {
        async.auto({
            groups  : Group.find({}).select('name email').exec,
            members : Member.find({email: {$exists: true}}).select('name email').exec
        }, function complete(err, data) {
            if (!err) {
                res.render('emails', {
                    title   : 'Email listing',
                    session : req.session,
                    groups  : _.uniq(data.groups),
                    members : _.uniq(data.members)
                });
            } else {
                res.send('There was an error fetching this.');
                console.error(err);
            }
        });
    });

    /** News */
    router.post('/news', util.admin, function (req, res) {
        var fs = require('fs'),
            imageMagick = require('gm').subClass({imageMagick: true});
        // Prep image
        imageMagick(req.files.image.path).resize(470).toBuffer('jpeg', function (err, buffer) {
            // Create news
            News.create({
                title   : req.body.title,
                content : req.body.content,
                date    : new Date(req.body.date),
                author  : req.body.author,
                image   : buffer.toString('base64')
            }, function (err, news) {
                if (!err) {
                    res.redirect('/news');
                } else {
                    res.send('There was an error:\n' + err);
                    console.error(err);
                }
            });
        });
    });

    router.route('/news/:id').delete(util.admin, function (req, res) {
        News.remove({_id: req.params.id}).exec(function (err) {
            if (!err) {
                res.redirect('/news');
            } else {
                res.send('There was an error:\n' + err);
                console.error(err);
            }
        });
    });

    /** FAQs */
    router.post('/faq/section', util.admin, function (req, res) {
        var Faq = require('../schema/Faq');
        Faq.create({
            title   : req.body.title,
            prelude : req.body.prelude,
            items   : []
        }, function (err, section) {
            if (!err) {
                res.redirect('/faq');
            } else {
                res.send('There was an error:\n' + err);
                console.error(err);
            }
        });
    });

    router.get('/faq/del/:id', util.admin, function (req, res) {
        // Remove a section.
        Faq.remove({_id: req.params.id}).exec(function (err) {
            if (!err) {
                res.redirect('/faq');
            } else {
                res.send('There was an error:\n' + err);
                console.error(err);
            }
        });
    });

    router.get('/faq/del/:section/:id', util.admin, function (req, res) {
        var ObjectId = require('mongoose').Schema.ObjectId;
        // Remove a section.
        Faq.findByIdAndUpdate(req.params.section, {
            $pull: {
                items: {
                    _id: req.params.id
                }
            }
        }).exec(function (err) {
            if (!err) {
                res.redirect('/faq');
            } else {
                res.send('There was an error:\n' + err);
                console.error(err);
            }
        });
    });

    router.post('/faq/question', util.admin, function (req, res) {
        // Place an item in.
        Faq.findById(req.body.section).exec(function (err, faq) {
            // Non-atomic so the middleware fires.
            faq.items.push({
                question : req.body.question,
                answer   : req.body.answer
            });
            faq.save(function (err) {
                if (!err) {
                    res.redirect('/faq');
                } else {
                    var message = "Couldn't do it!";
                    res.redirect('/faq?message=' + message);
                }
            });
        });
    });

    return router;
};
