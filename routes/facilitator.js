'use strict';

var async = require('async'),
      _ = require('lodash'),
      Facilitator = require('../schema/Facilitator');

module.exports = function(data) {
    var router = require('express').Router();

    router.get('/facilitator', function (req, res) {
        res.render('facilitator-application', {
            title    : "Facilitator Application",
            session  : req.session,
            lastForm : req.session.lastForm || {}
        });
    });

    router.post('/facilitator', function (req, res) {
        var audience = [],
              type = [];
        _.forEach(['youth', 'youngAdult', 'chaperone'], function (val) {
            if (req.body['audience-' + val]) { audience.push(val); }
        });
        _.forEach(['presentation', 'exercise', 'roleplay', 'qa', 'other'], function (val) {
            if (req.body['type-' + val]) { type.push(val); }
        });
        Facilitator.create({
            name             : req.body.name,
            affiliation      : req.body.affiliation,
            phone            : req.body.phone,
            fax              : req.body.fax,
            email            : req.body.email,
            mailing          : req.body.mailing,
            workshop         : req.body.workshop,
            length           : req.body.length,
            category         : req.body.category,
            categoryReason   : req.body.categoryReason,
            audience         : audience,
            type             : type,
            description      : req.body.description,
            summary          : req.body.summary,
            interactionLevel : req.body.interactionLevel,
            equipment        : {
                flipchart : (req.body['equiptment-flipchart'])? (req.body['equipment-flipchartNumber'] || 1) : 0,
                projector : (req.body['equipment-projector'] === 'on'),
                screen    : (req.body['equipment-screen'] === 'on'),
                player    : (req.body['equipment-player'] === 'on')
            },
            roomRequirement : req.body.roomRequirement,
            capacity        : req.body.capacity,
            biography       : req.body.biography,
            compensation    : {
                meal          : (req.body['compensation-meal'] === 'on'),
                accommodation : (req.body['compensation-accommodation'] === 'on'),
                travel        : (req.body['compensation-travel'])? (req.body['compensation-travelAmount'] || 'Marked, but unspecified') : '',
                honorarium    : (req.body['compensation-honorarium'])? (req.body['compensation-honorariumAmount'] || 'Marked, but unspecified') : ''
            },
            notes            : req.body.notes,
        }, function (err) {
            var message;
            if (err) {
                req.session.lastForm = req.body;
                message              = "Something went wrong, sorry! Did you forget a field? All are required. If you're still struggling, please call us.";
                res.redirect('/facilitator?message=' + message);
            } else {
                req.session.lastForm = {};
                message              = "Thank you for your facilitator application for Gathering Our Voices 2015. Workshop Selection will occur in early December and you should be notified about the status of your application by mid-December 2015. If you have any questions or require any further information please contact Gregory Forsberg at gatheringourvoices@bcaafc.com or 1-800-990-2432.";
                res.redirect('/?message=' + message);
            }
        });
    });

    return router;
};
