'use strict';

var async = require('async'),
    _ = require('lodash');

module.exports = function(data) {
  var router = require('express').Router(),
      News = require('../schema/News');

  router.get('/', function (req, res) {
    res.render('index', {
      title: 'Home',
      session: req.session
    });
  });

  var marked = require('marked');
  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true
  });
  router.get('/news', function (req, res) {
    News.find({}).sort('-date').exec(function (err, news) {
      res.render('news', {
        title: 'News',
        session: req.session,
        news: _.map(news, function (val) {
          val.content = marked(val.content);
          return val;
        })
      });
    });
  });

  router.get('/conduct', function (req, res) {
    res.render('conduct', {
      title: 'Code of Conduct',
      session: req.session
    });
  });

  router.get('/about', function (req, res) {
    res.render('about', {
      title: 'About Us',
      session: req.session
    });
  });

  router.get('/schedule', function (req, res) {
    res.render('schedule', {
      title: 'Schedule',
      session: req.session
    });
  });

  router.get('/privacy', function (req, res) {
    res.render('privacy', {
      title: 'Privacy',
      session: req.session
    });
  });

  router.get('/faq', function (req, res) {
    res.render('faq', {
      title: 'Frequently Asked Questions',
      session: req.session
    });
  });

  router.get('/venues', function (req, res) {
    res.render('venues', {
      title: 'Venues',
      session: req.session
    });
  });

  router.get('/accommodations', function (req, res) {
    res.render('accommodations', {
      title: 'Accommodations',
      session: req.session
    });
  });

  return router;
};
