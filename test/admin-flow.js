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
        test.assertExists("a[href='/admin/facilitators']", "Link to facilitators present");
        test.assertExists("a[href='/admin/members']", "Link to members present");
        test.assertExists("a[href='/admin/groups']", "Link to groups present, and active.");
        test.assertExists("table", "Table exists");
        test.assertExists("table tbody tr", "Row exists in table.");
    }).run(function () {
        test.done();
    });
});

/** Statistics */
casper.test.begin('Statistics page seems populated', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.admin.email, password: util.admin.password }, true);
        // Success brings us to account page.
    }).waitForUrl(/account$/, function () {
        this.click("a[href='/admin']");
    }).waitForUrl(/admin\/groups$/, function () {
        this.click("a[href='/statistics']");
    }).waitForUrl(/statistics$/, function () {
        test.assertExists("#typeChart");
        test.assertExists("#ageChart");
        test.assertExists("#regionChart");
        test.assertExists("#dateChart");
    }).run(function () {
        test.done();
    });
});

/** Workshops */
casper.test.begin('Able to create workshops', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.admin.email, password: util.admin.password }, true);
        // Success brings us to account page.
    }).waitForUrl(/account$/, function () {
        this.click("a[href='/workshops']");
    }).waitForUrl(/workshops$/, function () {
        // Should be nothing there... yet.
        test.assertExists('.alert.alert-success.lead', 'Notice about availability present.');
        // As an admin, we should have a button to create a workshop.
        test.assertExists('a[href="/workshop/create"]', 'Link to create workshop present.');
    }).run(function () {
        test.done();
    });
});
