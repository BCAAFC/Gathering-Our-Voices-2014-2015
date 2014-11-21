/**
 * The goal of this test suite is to ensure admin functionality is working as
 * intended.
 */
var util = require('./util');

/** Config */
casper.viewportSize = {width: 1440, height: 900};
var host            = 'http://localhost:8080';

/** Admin Screen */
casper.test.begin('Able to register as an admin', function suite(test) {
    casper.start(host + '/register', function () {
        var admin = util.group;
        this.fill("form[action='/register']", util.admin, true);
    }).waitForUrl(/account$/, function () {
        test.assertUrlMatch(/account$/, "Sent to account page");
        test.assertExists("a[href='/admin']", "Admin link exists in navbar");
    }).run(function () {
        test.done();
    });
});

casper.test.begin('Admin page seems populated', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.admin.email, password: util.admin.password }, true);
        // Success brings us to account page.
    }).waitForUrl(/account$/, function () {
        this.click("a[href='/admin']");
    }).waitForUrl(/admin\/groups$/, function () {
        test.assertExists("a[href='/statistics']", "Link to statistics present");
        test.assertExists("a[href='/emails']", "Link to emails present");
        test.assertExists(".tabled#facilitators a", "Link to facilitators present");
        test.assertExists(".tabled#members a", "Link to members present");
        test.assertExists(".tabled.active#groups a", "Link to groups present, and active.");
    }).run(function () {
        test.done();
    });
});

/** Statistics */
casper.test.begin('Admin page seems populated', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.admin.email, password: util.admin.password }, true);
        // Success brings us to account page.
    }).waitForUrl(/account$/, function () {
        this.click("a[href='/admin']");
    }).waitForUrl(/admin\/groups$/, function () {
        this.click("a[href='/statistics']");
    }).waitForUrl(/statistics$/, function () {
        test.assertExists("");
    }).run(function () {
        test.done();
    });
});
