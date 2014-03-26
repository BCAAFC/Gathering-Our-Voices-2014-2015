Group = require("../schema/Group")

## We need Mandrill for mailouts ##
# Get Redis working
redis = require('redis')
config = require('../config')
if config.redis
  url    = require("url")
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
    printout: (req, res) ->
      Group.model.findById(req.session.group._id).populate("_members").populate("_payments").exec (err, group) ->
        if !group?
          return
        # Populate some data
        group.getCost (err, cost) ->
          group.getPaid (err, paid) ->
            group.stats = {
              "": {"Early": 0, "Regular": 0},
              "Youth": {"Early": 0, "Regular": 0},
              "Young Adult": {"Early": 0, "Regular": 0},
              "Chaperone": {"Early": 0, "Regular": 0},
              "Young Chaperone": {"Early": 0, "Regular": 0},
              "youthInCare": 0,
              "youthInCareSupport": 0
            }
            group._members.map (val) ->
              group.stats[val.type][val._state.ticketType]++
              if val._state.youthInCare
                group.stats['youthInCare']++
              if val._state.youthInCareSupport
                group.stats['youthInCareSupport']++
              return
            # Render
            res.render "printout",
              session: req.session
              group: group
              cost: cost
              paid: paid
    checkin: (req, res) ->
      # Check in a group
      if req.params.id?
        Group.model.findOne _id: req.params.id, (err, group) ->
          if err or !group?
            res.redirect "/admin?message=No Group Found."
          else
            group._state.checkedIn = !group._state.checkedIn
            group.save (err) ->
              if err
                res.redirect "/admin?message=Group not checked in."
              else
                res.redirect "/admin?message=#{group.affiliation} checked in."
      else
        # Didn't get an ID.
        res.redirect "/admin"
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
        # Site is archived.
        return res.redirect "/register?message=This site has been archived, please email ahobden@bcaafc.com if you think this is in error."
        
        # Creating a new group.
        # Do some basic sanitization of input.
        Group.model.create {
          email:        req.body.email
          password:     req.body.password
          name:         req.body.name
          affiliation:  req.body.affiliation
          address:      req.body.address
          city:         req.body.city
          region:       req.body.region
          province:     req.body.province
          postalCode:   req.body.postalCode
          fax:          req.body.fax
          phone:        req.body.phone
          affiliationType: req.body.affiliationType
        }, (err, group) ->
          unless err?
            req.session.group = group
            mandrill '/messages/send', {
              message: {
                to: [{email: group.email, name: group.name}, {email: "dpreston@bcaafc.com", name: "Della Preston"}, {email: "klow@bcaafc.com", name: "Kerri Low"}]
                from_email: 'gatheringourvoices@bcaafc.com'
                subject: "GOV2014 Registration"
                html: "
<h2>Thank you for submitting your online registration!</h2>
The Gathering Our Voices Team will review your registration and contact you via email regarding the following:

<ul>
 <li>Member Information: You can add group members from the \"Account\" Page. When adding a new member, all that is required is a name, which you're free to make a placeholder. We ask that you try to populate your group with members (even placeholders!) as soon as you can for a number of reasons. First, so we can have more accurate estimations for catering and bookings, second, you won't have to get all of the information from your members right away. Members which are incomplete will be marked appropriately with a red label, you can just click on that label (or the complete label) at any time to edit their information.</li>
  <li>Payment: You can view your current payment status from the \"Account\" Page, just hit the orange \"Manage Payments\" button.</li>
  <li>Workshops: You may join workshops <b>immediately</b> after completing a members information.</li>
</ul>

If you have any questions take a look at our FAQ, or connect with me!

<h2>Delegate registration: Complete by March 14 – (onsite changes will be limited)</h2>
Please complete your members registration including all detailed information. You can manage you registration from your mobile devices for easy access and convenience.
 
<h2>Payments: DUE March 18, 2014</h2>
For the groups and delegates registered by February 7th, we will honor the early registration fee until March 18th. If payment is not receive by March 18th, all delegates will be charged the regular registration fee of $175 and payment will be due 10 business day later: April 1, 2014.
<br>
For the groups and delegates that register after February 7th, you will be required to pay the regular registration fee of $175 also due March 18th.
<br>
<b>On-site payment will be accepted by VISA, MasterCard, Cheque or Money Order. We cannot accept cash onsite.</b>
<br>
Question contacts Kerri Low at 250-388-5522 or 1-900-990-2432
 
<h2>Workshop registration: Complete by March 14  - (onsite changes and spaces will be limited, sign up early)</h2>
The full workshop schedule has been released! To sign up for workshops each delegate will need their full personal information complete. The workshop listings page can be view by all delegates, but only the primary contact can register the members into workshops. We encourage primary contacts to share this link with your youth so they can view the workshops. Also be prepared for active workshops: bring running shoes, shorts, water bottles & active wear.
<br>
Workshop Page:  https://gatheringourvoices.bcaafc.com/workshops
<br>
For information about workshops contact Greg Forsberg, Workshops and Logistics Coordinator at gatheringourvoices@bcaafc.com or by telephone: 250-388-5522 or 1-800-990-2432.
<br>
<br>
<b>Book your accommodations:</b>
<br>
Book at the Fairmont Vancouver ($189/night) - https://resweb.passkey.com/go/gatheringourvoices
<br>
Book at the Hyatt Regency Vancouver ($189/night) - https://resweb.passkey.com/go/gov2014

<h2>Please reviews before coming to the conference with your group!</h2>
<b>Personal Conduct:</b>
Since your personal conduct, both in and out of the conference, reflects upon your community, please take a moment to review the code of conduct and distribute this to your group and your chaperones. Please ensure that as guests, your group members respect our hosts, volunteers, speakers, and peers to create an enjoyable and memorable event.
 
<b>Code of Conduct:</b>
<ul>
  <li>Weapons brought into conference venues and/or criminal activity of any kind will not be tolerated.</li>
  <li>Please refrain from wearing any non- prescription cosmetic lenses that alter or cover the eyes.</li>
  <li>There will be zero tolerance for drugs & alcohol use by delegates, chaperones, and guests during the event.  We will also not tolerate any bullying, violence or acts of harassment. Offending participants, along with their group, will be asked to leave in such circumstances.</li>
  <li>Offenders of the Code of Conduct will have all privileges suspended and may be removed from the conference with no refund.</li>
</ul>
 
On Thursday, March 20th there will be a dance for all youth and young adults. Please take a moment to review the code of conduct specific to this event.
 
<h2>Youth Dance Party:</h2>
<ul>
  <li>Door Open at 7:00 pm and will close at 8:30 pm. Re-entry will not be permitted. </li>
  <li>Chaperones are required to attend with their youth under 18 years of age.  Youth without chaperones WILL NOT be admitted.  Chaperones must also leave with their youth at the end of the night.</li>
  <li>All youth and chaperones will be searched prior to their entry to the dance and will be required to check all bags, purses, sweaters and jackets.</li>
  <li>We do not allow the consumption of energy drinks.</li>
  <li>Please refrain from wearing any non- prescription cosmetic lenses that alter or cover the eyes.</li>
</ul>
                "
              }
            }, (err, response) ->
              console.log err if err
              res.redirect "/account"
          else
            if err.code == 11000
              # Duplicate key.
              message = "That email has already registered a group. Try logging in?"
            else if err.errors
              # Not all information filled in.
              message = "You didn't fill out the following fields: "
              for key, val of err.errors
                console.log val.path
                message += val.path + " "
            else
              message = "Something went wrong that normally doesn't... Try again?"
            res.redirect "/register?message=#{message}"
      else
        # Logging into an exiting group.
        Group.model.login req.body.email, req.body.password, (err, group) ->
          unless err? or !group?
            req.session.isAdmin = true if group.isAdmin()
            req.session.group = group
            res.redirect "/account"
          else
            message = "We were unable to log you in. Either your password, email, or both are incorrect."
            res.redirect "/register?message=#{message}"
  put:
    account: (req, res) ->
      Group.model.findById req.session.group._id, (err, group) ->
        unless err or !group?
          # Login Details
          group.email = req.body.email
          group.password = req.body.password if req.body.password == req.body.passwordConfirm
          # Group Details
          group.name = req.body.name
          group.affiliation = req.body.affiliation
          group.address = req.body.address
          group.city = req.body.city
          group.region = req.body.region
          group.province = req.body.province
          group.postalCode = req.body.postalCode
          group.phone = req.body.phone
          group.fax = req.body.fax
          group.affiliationType = req.body.affiliationType
          group.save (err, group) ->
            unless err
              req.session.group = group
              res.redirect "/account"
            else
              message = # TODO
              res.redirect "/account?message=#{message}"
        else
          # TODO
  delete:
    account: (req, res) ->
      Group.model.findById req.params.id, (err, group) ->
        group.remove (err) ->
          res.send err || "Wow, you really did it. :("
}
