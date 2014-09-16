'use strict';

module.exports = {
  auth: function (req, res, next) {
    if (req.session && req.session.group) {
      next();
    } else {
      var message = "You're not authorized to visit this area, please log in.";
      res.redirect('/register?message=' + message); // TODO: URL Encode?
    }
  },
  inGroup: function (req, res, next) {
    if (req.session && req.session.group &&
      (req.session.group._members.indexOf(req.params.id) !== -1 || req.session.isAdmin)) {
      next();
    } else {
      var message = "You're not authorized to visit this area, please log in.";
      res.redirect('/register?message=' + message); // TODO: URL Encode?
    }
  },
  admin: function (req, res, next) {
    if (req.session && req.ression.group && req.session.isAdmin) {
      next();
    } else {
      var message = "You're not an administrator, and thusly cannot do this action.";
      res.redirect('/register?message=' + message); // TODO: URL Encode?
    }
  }
};
