###
Gathering Our Voices 2014
###
# Dependencies
express         = require("express")
fs              = require("fs")
mongoose        = require("mongoose")
redis           = require("redis")
# Express Bits
session         = require('express-session')
bodyParser      = require('body-parser')
cookieParser    = require('cookie-parser')
methodOverride  = require('method-override')
compression     = require('compression')
# End of Express Bits
RedisStore      = require("connect-redis")(session)
url             = require("url")

# Config Vars
config = require("./config")

# Our App
app = module.exports = express()

# Mongoose
mongoose.connect config.db, (err) ->
  if !err
    console.log "Connected to #{config.db} database"
  else
    console.log err

# Redis
if config.redis
  redisURL = url.parse(config.redis)
  redisClient = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true})
  redisClient.auth(redisURL.auth.split(":")[1])
else
  redisClient = redis.createClient()


# Middleware for the app
app.use (req, res, next) ->
  # If running development, don't forward!
  # Otherwise, forward to https!
  if config.ssl && req.headers['x-forwarded-proto'] != "https" && req.host != "localhost"
    res.redirect('https://' + req.host + req.url)
  else
    next()

app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: true)
app.use(methodOverride (req, res) ->  # Allows PUT/DELETE in forms.
  if req.body?._method?
    # look in urlencoded POST bodies and delete it
    method = req.body._method
    delete req.body._method
    return method
)
app.use cookieParser(config.secret)
app.use session
  secret: config.secret,
  store: new RedisStore {client: redisClient}
  resave: true,
  saveUninitialized: true
app.use (req, res, next) ->
  if req.query.message
    req.session.message = req.query.message
  else
    req.session.message = null
  next()
app.use compression()

# Load Routes
require("./routes")(app)

app.use express.static "#{__dirname}/static", { maxAge: 86400000 * 4 } # 4 days.
app.use (req, res) -> # 404 Error
  res.status 404
  console.log new Error("This page doesn't exist")
  res.send "This page doesn't exist!"

# Settings
app.set "views", "#{__dirname}/views"
app.set "view engine", "jade"


# Listen on the configured port.
app.listen config.port, () ->
  console.log "Listening on port #{config.port}."

## Redo flags
# Group = require("./schema/Group")
# Group.model.find {}, (err, groups) ->
#   looper = (groups) ->
#     group = groups.pop()
#     if group?
#       group.checkFlags () ->
#         console.log group.name + " " + group._state.youthInCare
#         group.save () ->
#           looper(groups)
#   looper(groups)

## Check for Bugs
# Member = require("./schema/Member")
# Workshop = require("./schema/Workshop")
# Member.model.find({}).populate("_workshops._id").exec (err, members) ->
#   for member in members
#     for workshop in member._workshops
#       if workshop._id.session(workshop.session)._registered.indexOf(member._id) == -1
#         console.log "Member: #{member.name}, Workshop: #{workshop._id.name}, Session: #{workshop.session}, Group: #{member._group}"

## Workshop Bugs
# Member = require("./schema/Member")
# Workshop = require("./schema/Workshop")
# Workshop.model.find({}).exec (err, workshops) ->
#   checked = 0
#   for workshop in workshops
#     for session in workshop.sessions
#       for item, index in session._registered
#         checked += 1
#         if session._registered.indexOf(item) != index
#           console.log "There is a double, #{workshop.name}, #{session}"
#   console.log checked

# Get Allergies / Medical Conditions
# Member = require("./schema/Member")
# Member.model.find({}).exec (err, members) ->
#   allergyList = []
#   for member in members
#     console.log "#{member.name}  #{(allergy for allergy in member.emergencyInfo.allergies)}  #{(condition for condition in member.emergencyInfo.conditions)}"
#
