###
Member
  People going to the conference.
  Child Of:
    * 1..1 Group
  Has:
    * 1..6 Workshops
###

###
Setup
###
# Third Party Dependencies
mongoose = require("mongoose")

# Aliases
Schema   = mongoose.Schema
ObjectId = mongoose.Schema.ObjectId

###
Schema
###
MemberSchema = new Schema {
  # Member Details
  # Note that the commented out "required" is left so we know what is!
  name:
    type: String
    trim: true
    required: true
  type:
    type: String
    # required: true
    enum: [
      "",
      "Youth",
      "Young Adult",
      "Chaperone",
      "Young Chaperone"
    ]
    default: ""
  gender:
    type: String
    # required: true
    enum: [
      "",
      "Male",
      "Female",
      "Other"
    ]
    default: ""
  birthDate:
    # Why not use a Date? Because Javascript dates are gross.
    # Besides, we only care about day, month, year.
    day:
      type: Number
      # required: true
      min: 1
      max: 31
      default: null
    month:
      type: String
      # required: true
      enum: [
        "",
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
      default: ""
    year:
      type: Number
      # required: true
      min: 1900
      max: 2000 # 14 years old. Della signed off.
      default: null
  # Contact Details, these are optional.
  phone:
    type: String
    trim: true
    default: ""
  email:
    type: String
    match: /.*@.*\..*/ # Should match most emails.
    trim: true
    lowercase: true
    default: ""
  # Emergency Contact Info, Unlikely to be used but important!
  emergencyContact:
    name:
      type: String
      trim: true
      default: ""
      # required: true
    relation:
      type: String
      trim: true
      default: ""
      # required: true
    phone:
      type: String
      trim: true
      default: ""
      # required: true
  emergencyInfo:
    medicalNum:
      type: String
      trim: true
      default: ""
      # required: true
    allergies:
      type: [String]
      default: [""]
    conditions:
      type: [String]
      default: [""]
  # State variables
  _state:
    # This is checked via a middleware.
    complete:
      type: Boolean
      default: false
    ticketType:
      type: String
      default: "Regular"
      enum: [
        "Early",  # Before February 8th
        "Regular" # After February 8th
      ]
    registrationDate:
      type: Date
      default: Date.now
    youthInCare:
      type: Boolean
      default: false
    youthInCareSupport:
      type: Boolean
      default: false
  # Aggregations
  _workshops:
    type: [ # Store both the session and the id itself.
      session:    # This lets us do validation really quickly and easily.
        type: Number
        required: true
      _id:
        type: ObjectId
        ref: "Workshop"
        required: true
    ]
    default: []
  _group:
    type: ObjectId
    ref: "Group"
    required: true
}

###
Statics
  These are model based. So you'd call `User.model.foo()` if you had a static called `foo`
  `MemberSchema.statics.foo =`
###
# None yet!

###
Methods
  These are document based. So you'd call `fooMember.foo()` if you had a method called `foo`
  `MemberSchema.methods.foo =`
###
MemberSchema.methods.hasConflicts = (workshopId, session) ->
  if session == 0 or session == 13
    blocks = []
  else if (session % 3) is 0
    blocks = [session, session-2]
  else if (session % 3) is 1
    blocks = [session..session+2]
  else if (session % 3) is 2
    blocks = [session, session-1]
  conflicts = @_workshops.filter (val) ->
    return blocks.indexOf(val.session) != -1 # Don't return blocks
  if conflicts.length > 0
    return conflicts[0]
  else
    return false

MemberSchema.methods.addWorkshop = (workshopId, session, next) ->
  Workshop = require("./Workshop")
  if not @hasConflicts(workshopId, session)
    # Check that the workshop isn't full, if not, add us there.
    Workshop.model.findById workshopId, (err, workshop) =>
      if !err or !workshop
        if workshop.allows.indexOf(@type) != -1
          # Figure out the session we want, add the member.
          theSession = workshop.session(session)
          if theSession.capacity > theSession._registered.length
            theSession._registered.push @_id
            workshop.save (err) =>
              if !err
                @_workshops.push {session: session, _id: workshop._id}
                @save (err) =>
                  if !err
                    next null, @
                  else
                    next err, null
              else
                next err, null
          else
            next new Error("That workshop is at capacity"), null
            return # End early.
        else
          next new Error("Member type not permitted in this workshop."), null
      else
        next err || new Error("No workshop found"), null
  else
    next new Error("Can't register for this workshop, there is a conflict"), null

MemberSchema.methods.removeWorkshop = (workshopId, session, next) ->
  Workshop = require("./Workshop")
  Workshop.model.findById workshopId, (err, workshop) =>
    if !err or !workshop
      index = workshop.session(session)._registered.indexOf(@_id)
      # Remove the member from the workshop.
      workshop.session(session)._registered.splice(index, 1)
      workshop.save (err) =>
        if !err
          @_workshops = @_workshops.filter (val) =>
            return not (val.session == session and val._id.equals(workshopId))
          @save (err) =>
            if !err
              next null, @
            else
              next err, null
        else
          next err, null
    else
      next err || new Error("Workshop doesn't exist"), null

###
Pre/Post Middleware
  Middleware can be pre/post `init`, `validate`, `save`, `remove`
  NOTE: Atomic updates **do not** invoke middleware.
  `MemberSchema.pre 'bar', (next) ->`
  `MemberSchema.post 'bar', (next) ->`
###
MemberSchema.pre "save", (next) ->
  # Ensure they're not too young.
  if @birthDate["year"]? and @birthDate["year"] == 2000
    if @birthDate["month"]? and ["January", "February", "March"].indexOf(@birthDate["month"]) == -1
      next(new Error("Too young."))
  Group = require("./Group")
  # Make sure their group knows they're part of them.
  Group.model.findById @_group, (err, group) =>
    if err or !group?
      next err || new Error("Group doesn't exist")
    else if group._members.indexOf(@_id) is -1
      group._state.registration = "New Members"
      # Not in the group!
      group._members.push @_id
      # Does it have enough chaperones?
      group.checkFlags(() ->
        group.save (err) ->
          unless err
            next()
          else
            next err
      , @, "New")
    else
      # In the group already.
      group.checkFlags(() ->
        group.save (err) ->
          unless err
            next()
          else
            next err
      , @, "Edit")

MemberSchema.pre "save", (next) ->
  complete = true
  for item in ["type", "gender", "phone"]
    if @[item]? and @[item] == ""
      complete = false
      break
  # Birthdate
  for item in ["day", "month", "year"]
    if @birthDate[item]? and @birthDate[item] == ""
      complete = false
      break
  # Emergency Contact
  for item in ["name", "relation", "phone"]
    if @emergencyContact[item]? and @emergencyContact[item] == ""
      complete = false
      break
  # Emergency Info
  for item in ["medicalNum"]
    if @emergencyInfo[item]? and @emergencyInfo[item] == ""
      complete = false
      break
  @_state.complete = complete
  next()

MemberSchema.pre "save", (next) ->
  # If their registration date is before February 8th, make them an early bird.
  # It's important that if someone gets set to Earlybird, their ticket type isn't changed later.
  # If they are regular, we bump them up regardless.
  if Date.parse(@_state.registrationDate) < 1391817600000
    @_state.ticketType = "Early"
  next()

MemberSchema.pre "remove", (next) ->
  Group = require("./Group")
  # Remove the member from the group
  Group.model.findById @_group, (err, group) =>
    unless !group?
      index = group._members.indexOf @_id
      unless index is -1
        # Group exists, member is a part of it.
        group._members.splice index, 1
        # Do they have enough chaperones?
        group.checkFlags(() ->
          group.save (err) =>
            unless err
              next()
            else
              next err
        , @type, "Remove")

MemberSchema.pre "remove", (next) ->
  Workshop = require("./Workshop")
  # Remove the member from their workshops.
  memberWorkshops = @_workshops
  workshopIds = @_workshops.map (val) ->
    return val._id
  Workshop.model.find _id: {$in: workshopIds}, (err, workshops) =>
    errors = [] # If we have any.
    processor = (index) =>
      if index < memberWorkshops.length
        candidate = (workshops.filter (val) => val._id.equals(memberWorkshops[index]._id))[0]
        candIndex = candidate.session(memberWorkshops[index].session)._registered.indexOf @_id
        candidate.session(memberWorkshops[index].session)._registered.splice candIndex, 1
        candidate.save (err) ->
          errors.push err if err
          processor index+1
    processor 0
    unless errors.length > 0
      next()
    else
      next err



###
Validators
  Validators can be mapped to paths. It lets you validate on change.
  `MemberSchema.path('foo').validate (value) ->`
###
# None yet!

###
Export
###
# We should export both, just in case.
Member = mongoose.model("Member", MemberSchema)
module.exports =
  schema: MemberSchema
  model: Member
