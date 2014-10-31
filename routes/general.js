'use strict';

var async = require('async'),
    _     = require('lodash');

module.exports = function(data) {
    var router = require('express').Router(),
        News   = require('../schema/News'),
        Faq    = require('../schema/Faq');

    var marked = require('marked');
    marked.setOptions({
        gfm         : true,
        tables      : true,
        breaks      : true,
        smartLists  : true,
        smartypants : true
    });

    router.get('/', function (req, res) {
        res.render('index', {
            title   : 'Home',
            session : req.session
        });
    });


    router.get('/news', function (req, res) {
        News.find({}).sort('-date').exec(function (err, news) {
            res.render('news', {
                title   : 'News',
                session : req.session,
                news    : _.map(news, function (val) {
                    val.content = marked(val.content);
                    return val;
                })
            });
        });
    });

    router.get('/news/:id', function (req, res) {
        News.findById(req.params.id).exec(function (err, news) {
            news.content = marked(news.content);
            res.render('news', {
                title   : 'News',
                session : req.session,
                news    : [news]
            });
        });
    });

    router.get('/faq', function (req, res) {
        Faq.find({}).sort('title').exec(function (err, sections) {
            if (!err) {
                res.render('faq', {
                    title    : 'Frequently Asked Questions',
                    session  : req.session,
                    sections : _.map(sections, function (val) {
                        val.prelude = marked(val.prelude);
                        val.items = _.map(val.items, function (item) {
                            item.answer = marked(item.answer);
                            return item;
                        });
                        return val;
                    })
                });
            }
        });
    });

    router.get('/conduct', function (req, res) {
        res.render('conduct', {
            title   : 'Code of Conduct',
            session : req.session
        });
    });

    router.get('/about', function (req, res) {
        res.render('about', {
            title   : 'About Us',
            session : req.session
        });
    });

    router.get('/schedule', function (req, res) {
        res.render('schedule', {
            title   : 'Schedule',
            session : req.session
        });
    });

    router.get('/privacy', function (req, res) {
        res.render('privacy', {
            title   : 'Privacy',
            session : req.session
        });
    });

    router.get('/venues', function (req, res) {
        res.render('venues', {
            title   : 'Venues',
            session : req.session
        });
    });

    router.get('/accommodations', function (req, res) {
        res.render('accommodations', {
            title   : 'Accommodations',
            session : req.session
        });
    });

    return router;
};
