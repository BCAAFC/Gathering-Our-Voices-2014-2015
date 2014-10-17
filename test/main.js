var util = require('./util');

/** Config */
casper.viewportSize = {width: 1440, height: 900};
var host = 'http://localhost:8080';

casper.test.begin('Index seems healthy', function suite(test) {
    casper.start(host, function () {
        test.assertExists("nav", "There is a nav");
        test.assertExists(".timer", "There is a timer");
        test.assertExists(".progress > .progress-bar", "There is a progress bar");
    }).run(function () {
        test.done();
    });
});

/** Registration */
casper.test.begin('Registration works with complete information', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/register']", util.group, true);
    }).then(function () {
        // Success brings us to account page.
        test.assertUrlMatch(/account$/, "Sent to account page");
    }).run(function () {
        test.done();
    });
});

casper.test.begin('Registration fails with incomplete information', function suite(test) {
    casper.start(host + '/register', function () {
        var incomplete = util.group;
        delete util.group.city;
        this.fill("form[action='/register']", incomplete, true);
    }).then(function () {
        // Get redirected back, values should still be there.
        test.assertUrlMatch(/register\?message=/, "Redirected back to register page");
        test.assertField('address', util.group.address, "Filled-in values remain");
    }).run(function () {
        test.done();
    });
});

/** Login */
casper.test.begin('Login works with correct information', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.group.email, password: util.group.password }, true);
    }).then(function () {
        // On success we get sent to the account page.
        test.assertUrlMatch(/account$/, "Sent to account page");
    }).run(function () {
        test.done();
    });
});

casper.test.begin('Login fails with incorrect information', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.garbage(), password: util.garbage() }, true);
    }).then(function () {
        // Redirected due to invalid information.
        test.assertUrlMatch(/register\?message=/, "Sent back to login page");
    }).run(function () {
        test.done();
    });
});

/** Logout */
casper.test.begin('Logout works correctly', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.group.email, password: util.group.password }, true);
    }).then(function () {
        // Log out
        this.click("a[href='/logout']");
    }).then(function () {
        // Should be logged out. Check the navbar items.
        test.assertDoesntExist("a[href='/logout']", "Logout removes Logout button");
        test.assertExists("a[href='/register']", "Logout re-introduces Register");
    }).run(function () {
        test.done();
    });
});

/** Account Page */
casper.test.begin('Account page appears correct', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.group.email, password: util.group.password }, true);
    }).then(function () {
        // Conduct
        test.assertExists("#conduct button.btn.btn-danger > i.fa.fa-2x.fa-remove", "Conduct check is off");
        test.assertExists("#conduct a[href='/conduct']", "Link to conduct is present.");
        // Details
        test.assertExists("#details button.btn.btn-danger > i.fa.fa-2x.fa-remove", "Details check is off");
        test.assertExists("#details a[href='/details']", "Link to details section is present.");
        // Members
        test.assertExists("#members button.btn.btn-danger[disabled] > i.fa.fa-2x.fa-remove", "Members check is off, is disabled");
        test.assertExists("#members a[href='/member']", "Link to members section is present");
        test.assertExists("#members table", "Member table present");
        test.assertExists("#members #allowRemove", "Allow remove button is present");
        // Documents
        test.assertExists("#documents button.btn.btn-danger > i.fa.fa-2x.fa-remove", "Documents check is off");
        test.assertExists("#documents ul", "Document list is present");
        // Payments
        test.assertExists("#payments button.btn.btn-danger > i.fa.fa-2x.fa-remove", "Payments check is off");
        test.assertExists("#payments #cost", "Cost specification is present");
        test.assertExists("#payments #paid", "Paid specification is present");
        test.assertExists("#payments #balance", "Balance specification is present");
        // Workshops
        test.assertExists("#workshops button.btn.btn-danger > i.fa.fa-2x.fa-remove", "Workshops check is off");
    }).run(function () {
        test.done();
    });
});




//
