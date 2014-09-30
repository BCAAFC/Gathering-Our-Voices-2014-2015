###
Group
  The main group object.
  Has:
    * 1..* Members
    * 1..* Payments
###

###
Setup
###
# Third Party Dependencies
mongoose = require("mongoose")
bcrypt   = require("bcrypt")
# Aliases
Schema   = mongoose.Schema
ObjectId = mongoose.Schema.ObjectId

###
Schema
###
GroupSchema = new Schema {
  # Group Details
  email:
    type: String
    match: /.*@.*\..*/ # Should match most emails.
    trim: true
    required: true
    lowercase: true
    index:
      unique: true # No duplicates allowed.
  hash:
    type: String
  password: # NOTE: This isn't stored, it exists for our validation hook.
    type: String
    trim: true
  name:
    type: String
    trim: true
    required: true
  affiliation:
    type: String
    trim: true
    required: true
    index: true
  address:
    type: String
    trim: true
    required: true
  city:
    type: String
    trim: true
    required: true
  province:
    type: String
    trim: true
    required: true
    enum: [ # Must be one of these to work.
      "British Columbia",
      "Alberta",
      "Saskatchewan",
      "Manitoba",
      "Ontario",
      "Quebec",
      "New Brunswick",
      "Nova Scotia",
      "Prince Edward Island",
      "Newfoundland and Labrador",
      "Nunavut",
      "Northwest Territories",
      "Yukon",
      "Other (Outside Canada)"
    ]
  postalCode:
    type: String
    trim: true
    required: true
  fax:
    type: String
    trim: true
  phone:
    type: String
    trim: true
    required: true
  region:
    type: String
    trim: true
    required: true
    enum: [
      "North",
      "Interior",
      "Fraser",
      "Vancouver Coastal",
      "Vancouver Island",
      "Out of Province"
    ]
    default: "Out of Province"
  affiliationType:
    type: String
    trim: true
    required: true
    enum: [
      "Friendship Centre",
      "Off-reserve",
      "On-reserve",
      "Other"
    ]
    default: "Other"
  registrationDate:
    # Why not use a Date? Because Javascript dates are gross.
    # Besides, we only care about day, month, year.
    day:
      type: Number
      required: true
      min: 1
      max: 31
      default: (new Date).getDate() # Current Day of the month.
    month:
      type: String
      required: true
      enum: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
      # Current Month
      default: ["January","February","March","April","May","June","July","August","September","October","November","December"][(new Date).getMonth()]
    year:
      type: Number
      required: true
      min: 2013
      max: 2014
      default: (new Date()).getFullYear()
  # Private things we shouldn't accept values for during creation.
  _notes:
    type: String
    trim: true
  # State variables
  _state:
    tags:
      type: [
        type: String
        trim: true
      ]
      default: ''
    steps:
      conduct:
        type: Boolean
        default: false
      details:
        type: Boolean
        default: false
      members:
        type: Boolean
        default: false
      documents:
        type: Boolean
        default: false
      payments:
        type: Boolean
        default: false
      workshops:
        type: Boolean
        default: false
      checkin:
        type: Boolean
        default: false
  youthInCare:
    type: Number
    default: 0
    min: 0
    max: 200
  youthInCareSupport:
    type: Number
    default: 0
    min: 0
    max: 200
  # Aggregations
  _members: # A list of members.
    type: [
      type: ObjectId
      ref: "Member"
    ]
    default: []
  _payments:
    type: [ # A list of payments.
      type: ObjectId
      ref: "Payment"
    ]
    default: [] # Default to none.
}

###
Statics
  These are model based. So you'd call `User.model.foo()` if you had a static called `foo`
  `MemberSchema.statics.foo =`
###
GroupSchema.statics.login = (email, password, next) ->
  # Find the group.
  @.findOne email: email, (err, group) ->
    unless err or !group? or Object.keys(group).length is 0
      # Check their password.
      bcrypt.compare password, group.hash, (err, valid) ->
        unless not valid
          # Pass along.
          next null, group
        else
          next err or new Error("Wrong Password"), null
    else
      next err or new Error("Group doesn't exist!"), null

###
Methods
  These are document based. So you'd call `fooMember.foo()` if you had a method called `foo`
  `MemberSchema.methods.foo =`
###
GroupSchema.methods.addMember = (memberId, next) ->
  # You should create the member first, make sure it saves.
  @_members.push memberId
  @save (err, group) ->
    unless err
      next null, group
    else
      next err, null

GroupSchema.methods.getPaid = (next) ->
  Payment = require("./Payment")
  Payment.model.find _id: $in: @_payments, (err, payments) ->
    unless err
      sum = 0
      for payment in payments
        sum += payment.amount
      next err, sum
    else
      next err, null

GroupSchema.methods.getCost = (next) ->
  Member = require("./Member")
  Member.find _id: $in: @_members, (err, members) ->
    unless err
      # Accumulate ticket prices.
      due = members.map( (val) ->
        if val._state.ticketType is "Early"
          price = 150
        else
          price = 200
        return price
      ).reduce( (sum, val, index) ->
        unless (index+1) % 6 is 0
          return sum + val
        else
          return sum # This ticket is free!
      , 0)
      # Determine free tickets
      next null, due
    else
      next err, null

GroupSchema.methods.getBalance = (next) ->
  @getCost (err, cost) =>
    @getPaid (err, paid) =>
      unless err
        next null, (cost - paid)
      else
        next err, -1

GroupSchema.methods.isAdmin = () ->
  return (process.env.ADMINS.indexOf(@email) != -1)

GroupSchema.methods.enoughChaperones = (next) ->
  Member = require("./Member")
  _ = require('lodash')
  Member.find(_id: $in: @_members).select('type').exec (err, members) ->
    if (!err and members)
      reducer = (sum, member) ->
        sum[member.type] += 1
        return sum
      vals = _.reduce(members, reducer, {
        'Youth': 0,
        'Young Adult': 0,
        'Chaperone': 0,
        'Young Chaperone': 0
      })
      youth = vals['Youth']
      chaperones = (vals['Chaperone'] + vals['Young Chaperone']) * 5
      next(null, chaperones > youth)
    else
      next(err, false)

GroupSchema.methods.allComplete = (next) ->
  Member = require("./Member")
  _ = require('lodash')
  Member.find(_id: $in: @_members).select('_state.complete').exec (err, members) ->
    if (!err && members)
      complete = _.every(members, (member) ->
        return member._state.complete)
      next(null, complete)
    else
      next(err, false)

###
Validators
  Validators can be mapped to paths. It lets you validate on change.
  `MemberSchema.path('foo').validate (value) ->`
###
# None yet!

###
Pre/Post Middleware
  Middleware can be pre/post `init`, `validate`, `save`, `remove`
  NOTE: Atomic updates **do not** invoke middleware.
  `MemberSchema.pre 'bar', (next) ->`
  `MemberSchema.post 'bar', (next) ->`
###
GroupSchema.pre 'validate', (next) ->
  # If the `password` attribute is set, hash it and clear it.
  if @password
    bcrypt.hash @password, 10, (err, @hash) =>
      unless err
        @password = undefined # Get rid of the password.
        next()
      else
        next(err)
  else
    next()

GroupSchema.pre "remove", (next) ->
  memberIds = @_members
  paymentIds = @_payments
  processMembers = () ->
    Member = require("./Member")
    # Remove all members and payments.
    Member.find _id: $in: memberIds, (err, members) =>
      errs = []
      memLooper = (members) =>
        member = members.shift()
        if member
          member.remove (err) ->
            if err
              errs.push err
            memLooper(members)
        else
          processPayments()
      if members
        memLooper(members)
      else processPayments()
  processPayments = () ->
    Payment = require("./Payment")
    Payment.model.find _id: $in: paymentIds, (err, payments) =>
      payLooper = (members) =>
        payment = payments.shift()
        if payment
          payment.remove (err) ->
            if err
              errs.push err
            payLooper(payment)
        else
          next()
      if payments
        payLooper(payments)
      else
        next()
  processMembers()




###
Export
###
# We should export both, just in case.
Group = mongoose.model("Group", GroupSchema)
module.exports =
  schema: GroupSchema
  model: Group
