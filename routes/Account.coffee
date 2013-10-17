Group = require("../schema/Group")

## We need Mandrill for mailouts ##
# Get Redis working
redis = require('redis')
config = require('../config')
if config.redis
  redisURL = url.parse(config.redis)
  redisClient = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true})
  redisClient.auth(redisURL.auth.split(":")[1])
else
  redisClient = redis.createClient()

mandrill = require("node-mandrill")(config.mandrill_key)

AccountRoutes = module.exports = {
  get:
    register: (req, res) ->
      res.render "register",
        session: req.session
        head:
          title: "Registration"
          caption: "Get started with your group, or access your existing cohort."
          bg: "/img/bg/register.jpg"
        errors: req.query.errors
    logout: (req, res) ->
      req.session.regenerate ->
        res.redirect "/"
    account: (req, res) ->
      Group.model.findById(req.session.group._id).populate("_members").exec (err, group) ->
        res.render "account",
          session: req.session
          head:
            title: "Account"
            caption: "Manage, grow, or shrink your group as needed."
            bg: "/img/bg/account.jpg"
          members: group._members
          errors: req.query.errors
    recover: (req, res) ->
      # Start recovery
      Group.model.findOne email: req.params.email, (err, group) ->
        unless err or !group?
          hash = Math.random().toString(36).slice(2)
          redisClient.set hash, group._id, (err, redisResponse) ->
            mandrill '/messages/send', {
              message: {
                to: [{email: group.email, name: group.name}]
                from_email: 'gatheringourvoices@bcaafc.com'
                subject: "GOV2014 Password Recovery"
                html: "<p>Someone (hopefully you) has requested a password reset on your account.</p>
                       <p>If this was you, please visit <a href='gatheringourvoices.bcaafc.com/recovery/#{hash}'>this link</a> to get to your account management screen. From there, please click the purple 'Group Details' button and change your password.</p>
                       <p>If it wasn't you, please disregard this email.</p>"
              }
            }, (err, response) ->
              unless err
                res.send "We've sent an email to the address you provided us. Please check your inbox"
              else
                res.send "We weren't able to send you a recovery email. Please contact dpreston@bcaaf.com"
        else
          res.redirect "/register"
    recovery: (req, res) ->
      redisClient.get req.params.hash, (err, response) ->
        redisClient.del req.params.hash
        unless err or !response?
          Group.model.findById response, (err, group) ->
            req.session.group = group
            res.redirect "/account"
        else
          res.redirect "/register"
  post:
    login: (req, res) ->
      if req.body.passwordConfirm? and req.body.passwordConfirm is req.body.password
        # Creating a new group.
        # Do some basic sanitization of input.
        Group.model.create {
          email:        req.body.email
          password:     req.body.password
          name:         req.body.name
          affiliation:  req.body.affiliation
          address:      req.body.address
          city:         req.body.city
          province:     req.body.province
          postalCode:   req.body.postalCode
          fax:          req.body.fax
          phone:        req.body.phone
        }, (err, group) ->
          unless err?
            req.session.group = group
            mandrill '/messages/send', {
              message: {
                to: [{email: group.email, name: group.name}]
                from_email: 'gatheringourvoices@bcaafc.com'
                subject: "GOV2014 Registration"
                html: "<p>Hello! This is a placeholder email which we will need to make something else later. If you're still seeing this it means we haven't launched yet... So your group will be removed at a later date and all data will be irrecovably lost.</p>"
              }
            }, (err, response) ->
              console.log err if err
              res.redirect "/account"
          else
            res.redirect "/register?errors=#{JSON.stringify(err)}"
      else
        # Logging into an exiting group.
        Group.model.login req.body.email, req.body.password, (err, group) ->
          unless err? or !group?
            req.session.isAdmin = true if group.isAdmin()
            req.session.group = group
            res.redirect "/account"
          else
            errors = JSON.stringify({errors: err.toString()})
            res.redirect "/register?errors=#{errors}"
  put:
    account: (req, res) ->
      Group.model.findById req.session.group._id, (err, group) ->
        # Login Details
        group.email = req.body.email
        group.password = req.body.password if req.body.password == req.body.passwordConfirm
        # Group Details
        group.name = req.body.name
        group.affiliation = req.body.affiliation
        group.address = req.body.address
        group.city = req.body.city
        group.province = req.body.province
        group.postalCode = req.body.postalCode
        group.phone = req.body.phone
        group.fax = req.body.fax
        group.save (err, group) ->
          unless err
            req.session.group = group
            res.redirect "/account"
          else
            errors = JSON.stringify({err})
            res.redirect "/account?errors=#{err}"
  delete:
    account: (req, res) ->
      Group.model.findById req.params.id, (err, group) ->
        group.remove (err) ->
          res.send err || "Wow, you really did it. :("
}
