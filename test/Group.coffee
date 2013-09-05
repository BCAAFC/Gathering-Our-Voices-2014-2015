###
Group
  Tests the Group database found in `schema/Group.coffee`
###
# Third Party Dependencies
should = require("should")
mongoose = require("mongoose")
# First Party Dependencies
Group = require("../schema/Group")
Member = require("../schema/Member")
Payment = require("../schema/Payment")

###
Setup
  Necessary setup for tests.
###
# We use an temp database for testing this.
mongoose.connect "localhost/test", (err) ->

###
Tests
###
describe "Group", ->
  testGroup = null
  before (done) ->
    Group.model.remove {}, done

  describe "Group.create", ->
    it "Should register new groups with valid info", (done) ->
      Group.model.create {
        email:          "foo@bar.baz"
        password:       "foo"
        name:           "foo bar"
        affiliation:    "foo Native Friendship Centre"
        address:        "123 Foo Ave"
        city:           "Victoria"
        province:       "British Columbia"
        postalCode:     "A1B 2C3"
        fax:            ""
        phone:          "(123) 123-1234"
      }, (err, group) =>
        should.equal group.email, "foo@bar.baz"
        should.exist group.hash
        should.not.exist group.password
        should.equal group.name, "foo bar"
        should.equal group.affiliation, "foo Native Friendship Centre"
        should.equal group.address, "123 Foo Ave"
        should.equal group.province, "British Columbia"
        should.equal group.postalCode, "A1B 2C3"
        should.exist group.fax
        should.equal group.phone, "(123) 123-1234"
        testGroup = group._id
        done()
    it "Should not register existing groups with valid info", (done) ->
      # This should exist from our first test.
      Group.model.create {
        email:          "foo@bar.baz"
        password:       "foo"
        name:           "foo bar"
        affiliation:    "foo Native Friendship Centre"
        address:        "123 Foo Ave"
        city:           "Victoria"
        province:       "British Columbia"
        postalCode:     "A1B 2C3"
        fax:            ""
        phone:          "(123) 123-1234"
      }, (err, group) =>
        should.exist err
        should.not.exist group
        done()
    it "Should not register new groups with not valid info", (done) ->
      # This should exist from our first test.
      Group.model.create {
        email:          "foo@bar.baz"
        password:       "foo"
        name:           "foo bar"
        affiliation:    "foo Native Friendship Centre"
        #address:        "123 Foo Ave"
        #city:           "Victoria"
        province:       "British Columbia"
        postalCode:     "A1B 2C3"
        fax:            ""
        phone:          "(123) 123-1234"
      }, (err, group) =>
        should.exist err
        should.not.exist group
        done()

  describe "Group.login", ->
    it "Should log in existing users with valid info", (done) ->
      Group.model.login "foo@bar.baz", "foo", (err, group) ->
        should.exist group
        should.not.exist err
        should.equal group.email, "foo@bar.baz"
        done()
    it "Should not log in existing users with invalid info", (done) ->
      Group.model.login "foo@bar.baz", "wrong_password", (err, group) ->
        should.not.exist group
        done()
    it "Should not log in new users", (done) ->
      Group.model.login "new@user.ca", "", (err, group) ->
        should.not.exist group
        should.exist err
        done()

  describe "Group.find -> Edit -> Group.save()", ->
    it "Should allow the group to edit it's details, including password", (done) ->
      Group.model.findById testGroup, (err, group) ->
        should.not.exist err
        should.exist group
        group.password = "potato"
        group.save (err) ->
          should.not.exist err
          Group.model.login "foo@bar.baz", "potato", (err, group) ->
            should.not.exist err
            should.exist group
            group.password = "foo"
            group.save (err) ->
              should.not.exist err
              done()

  describe "Group.find -> group.remove()", ->
    it "Should remove the group, it's members, and payments", (done) ->
      Group.model.findById testGroup, (err, group) ->
        should.not.exist err
        should.exist group
        group.remove (err) ->
          should.not.exist err
          Member.model.find _group: testGroup, (err, members) ->
            should.equal members.length, 0
            should.not.exist err
            Payment.model.find _group: testGroup, (err, payments) ->
              should.equal payments.length, 0
              should.not.exist err
              done()