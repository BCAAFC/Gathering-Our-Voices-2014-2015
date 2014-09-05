module.exports =
  # Which port will it run on? 8080 is a good default for local development.
  port: (process.env.PORT || 8080),
  # The URI of a Mongo Database.
  db: (process.env.MONGOLAB_URI || 'localhost/dev'),
  # The URI of a Redis Database.
  redis: process.env.REDISCLOUD_URL,
  # The Cookie Secret, don't share this!
  secret: (process.env.secret || 'test'),
  # An array of administrator emails.
  admins: (process.env.admins || ['andrew@hoverbear.org']),
  # The API key for Mandrill.
  mandrill_key: process.env.MANDRILL_APIKEY,
  # Is this using SSL?
  # Note: You should not use non-SSL in production.
  ssl: (process.env.ssl || false)
