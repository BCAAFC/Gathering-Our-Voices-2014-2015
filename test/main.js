/**
 * The goal of this test is to go through the standard procedure of registering
 * a group. It does not make an effort to expose edge cases or verify values,
 * just makes sure a group can register without errors. It does not use the
 * admin interface to verify things.
 */

var util = require('./util');

/** Config */
casper.viewportSize = {width: 1440, height: 900};
var host            = 'http://localhost:8080';

/** Index */
casper.test.begin('Index seems healthy', function suite(test) {
    casper.start(host, function () {
        test.assertExists("nav", "There is a nav");
        test.assertExists(".timer", "There is a timer");
        test.assertExists(".progress > .progress-bar", "There is a progress bar");
        test.assertExists("a[href='/register']", "There is a link to registration");
    }).run(function () {
        test.done();
    });
});

/** Registration */
casper.test.begin('Registration works with complete information', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/register']", util.group, true);
        // Success brings us to account page.
    }).waitForUrl(/account$/, function () {
        test.assertUrlMatch(/account$/, "Sent to account page");
    }).run(function () {
        test.done();
    });
});

casper.test.begin('Registration fails with incomplete information', function suite(test) {
    casper.start(host + '/register', function () {
        var incomplete = util.group;
        delete incomplete.city;
        this.fill("form[action='/register']", incomplete, true);
        // Get redirected back, values should still be there.
    }).waitForUrl(/register\?message=/, function () {
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
    }).waitForUrl(/account$/, function () {
        // On success we get sent to the account page.
        test.assertUrlMatch(/account$/, "Sent to account page");
    }).run(function () {
        test.done();
    });
});

casper.test.begin('Login fails with incorrect information', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.garbage(), password: util.garbage() }, true);
    }).waitForUrl(/register\?message/, function () {
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
    }).waitForUrl(/account/, function () {
        // Log out
        this.click("a[href='/logout']");
    }).waitForUrl(/\/$/, function () {
        // Should be logged out. Check the navbar items.
        test.assertDoesntExist("a[href='/logout']", "Logout removes Logout button");
        test.assertExists("a[href='/register']", "Logout re-introduces Register");
    }).run(function () {
        test.done();
    });
});

/** Account Page */
casper.test.begin('Account page functions correct', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.group.email, password: util.group.password }, true);
    }).waitForUrl(/account$/, function () {
        // Workshops
        test.assertExists("#workshops button.btn.btn-danger > i.fa.fa-2x.fa-remove", "Workshops check is off");
    }).run(function () {
        test.done();
    });
});

/** Conduct Step */
casper.test.begin('Conduct Step', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.group.email, password: util.group.password }, true);
    }).waitForUrl(/account$/, function () {
        test.assertExists("#conduct button.btn-danger > .fa-remove", "Conduct check is off");
        test.assertExists("#conduct a[href='/conduct']", "Link to conduct is present");
        this.click("#conduct a[href='/conduct']");
    }).waitForUrl(/conduct$/, function () {
        test.assertUrlMatch(/conduct$/, "On conduct page");
        test.assertExists("button#agree", "Agree button exists");
        this.click("button#agree");
    }).waitForUrl(/account$/, function () {
        test.assertUrlMatch(/account$/, "Button click redirects to account page");
        test.assertExists("#conduct button.btn-success > .fa-check", "Conduct is checked off");
        this.click("#conduct a[href='/conduct']");
    }).waitForUrl(/conduct$/, function () {
        test.assertExists("a[href='/account']", "After checking off, the conduct form just has a link");
    }).run(function () {
        test.done();
    });
});

/** Details Step */
casper.test.begin('Details Step', function suite(test) {
    var updatedGroup = {
        email: 'test-update@test.ca',
        password: 'test-update',
        passwordConfirm: 'test-update',
        name: 'test name (updated)',
        affiliation: 'test affilication (updated)',
        address: 'test address (updated)',
        city: 'test city (updated)',
        region: 'Interior',
        province: 'British Columbia',
        postalCode: 'A1B 2C3 (updated)',
        phone: '(123) 456-7890 (updated)',
        affiliationType: 'Friendship Centre'
    };
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.group.email, password: util.group.password }, true);
    }).waitForUrl(/account$/, function () {
        test.assertExists("#details button.btn-danger > .fa-remove", "Details check is off");
        test.assertExists("#details a[href='/details']", "Link to details section is present");
        this.click("#details a[href='/details']");
    }).waitForUrl(/details$/, function () {
        test.assertUrlMatch(/details$/, "Directed to details page");
        // Can change some basic details.
        this.fill("form[action='/details']", updatedGroup, true);
    }).waitForUrl(/account$/, function () {
        this.click("a[href='/logout']");
    }).waitForUrl(/\//, function () {
        this.click("a[href='/register']");
    }).waitForUrl(/register$/, function () {
        this.fill("form[action='/login']", { email: 'test-update@test.ca', password: 'test-update' }, true);
    }).waitForUrl(/account$/, function () {
        this.click("#details a[href='/details']");
    }).waitForUrl(/details$/, function () {
        // Verify changed fields.
        test.assertField('email', updatedGroup.email, "email was correctly updated");
        test.assertField('name', updatedGroup.name, "name was correctly updated");
        test.assertField('affiliation', updatedGroup.affiliation, "affiliation was correctly updated");
        test.assertField('address', updatedGroup.address, "address was correctly updated");
        test.assertField('affiliation', updatedGroup.affiliation, "affiliation was correctly updated");
        test.assertField('address', updatedGroup.address, "address was correctly updated");
        test.assertField('city', updatedGroup.city, "city was correctly updated");
        test.assertField('region', updatedGroup.region, "region was correctly updated");
        test.assertField('province', updatedGroup.province, "province was correctly updated");
        test.assertField('postalCode', updatedGroup.postalCode, "postalCode was correctly updated");
        test.assertField('affiliationType', updatedGroup.affiliationType, "affiliationType was correctly updated");
        this.fill("form[action='/details']", util.group, true);
    }).waitForUrl(/account$/, function () {
        // Button
        test.assertExists("#details button.btn-success > .fa-check", "Details check is on");
    }).run(function () {
        test.done();
    });
});

/** Youth In Care */
casper.test.begin('Youth In Care Step', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.group.email, password: util.group.password }, true);
    }).waitForUrl(/account$/, function () {
        test.assertExists("#youthInCare button.btn-danger > .fa-remove", "Youth in Care check is off");
        test.assertExists("#youthInCare form[action='/youthInCare']", "Form for YIC exists");
        this.fill("form[action='/youthInCare']", { youthInCare: 4, youthInCareSupport: 5 }, true);
    }).waitForUrl(/account$/, function () {
        test.assertField("youthInCare", '4', "Youth in Care has the value set.");
        test.assertField("youthInCareSupport", '5', "Youth in Care Support has the value set");
    }).run(function () {
        test.done();
    });
});

/** Members */
casper.test.begin('Member Step', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.group.email, password: util.group.password }, true);
    }).waitForUrl(/account$/, function () {
        // Visual verification
        test.assertExists("#members button.btn.btn-danger[disabled] > i.fa.fa-2x.fa-remove", "Members check is off, is disabled");
        test.assertExists("#members a[href='/member']", "Link to members section is present");
        test.assertExists("#members table", "Member table present");
        test.assertElementCount("#members table tbody tr", 0, "No members in table yet");
        test.assertExists("#members #allowRemove", "Allow remove button is present");
        // Add a complete member.
        this.click("a[href='/member']");
    }).waitForUrl(/member$/, function () {
        this.fill("form[action='/member']", util.member('Youth', 1999), true);
    }).waitForUrl(/account$/, function () {
        // Test that Member is added.
        test.assertElementCount("#members table tbody tr", 1, "One member in table");
        test.assertElementCount("#members table tbody tr td a", 1, "Edit button for member");
        test.assertElementCount("#members table tbody tr td button[disabled]", 1, "Remove button disabled for member");
        test.assertExists("#members table tbody tr[class='success']", "Added member is complete");
        test.assertDoesntExist("#enoughChaperones", "enoughChaperones is not marked");
        this.click("a[href='/member']");
    }).waitForUrl(/member$/, function () {
        // Add an Incomplete Member
        var incomplete = util.member('Chaperone', 1990);
        delete incomplete.phone;
        delete incomplete.emergRelation;
        this.fill("form[action='/member']", incomplete, true);
    }).waitForUrl(/account$/, function () {
        // Test that Member is added.
        test.assertElementCount("#members table tbody tr", 2, "Two member in table");
        test.assertExists("#members table tbody tr[class='danger']", "Added member is incomplete");
        test.assertDoesntExist("#membersComplete", "membersComplete is not marked");
        // Finish off the member.
        this.click("#members table tbody tr[class='danger'] td a");
    }).waitForUrl(/member\/.*$/, function () {
        this.fill("form", {phone: '123', emergRelation: 'testing'}, true);
    }).waitForUrl(/account$/, function () {
        // Test that Member is added.
        test.assertElementCount("#members table tbody tr", 2, "Two members in table");
        test.assertExists("#members table tbody tr[class='success']", "Both members complete");
        test.assertExists("#enoughChaperones", "enoughChaperones is marked");
        test.assertExists("#membersComplete", "membersComplete is marked");
    }).run(function () {
        test.done();
    });
});

/** Documents */
casper.test.begin('Document Step', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.group.email, password: util.group.password }, true);
    }).waitForUrl(/account$/, function () {
        // Documents
        test.assertExists("#documents button.btn.btn-danger > i.fa.fa-2x.fa-remove", "Documents check is off");
        test.assertExists("#documents ul", "Document list is present");
        test.assertExists("#documents ul li", "There is at least one document in the list");
    }).run(function () {
        test.done();
    });
});

/** Payments */
casper.test.begin('Payment Step', function suite(test) {
    casper.start(host + '/register', function () {
        this.fill("form[action='/login']", { email: util.group.email, password: util.group.password }, true);
    }).waitForUrl(/account$/, function () {
        // Payments
        test.assertExists("#payments button.btn-danger > i.fa-remove", "Payments check is off");
        test.assertExists("#payments #cost", "Cost specification is present on account page");
        test.assertExists("#payments #paid", "Paid specification is present on account page");
        test.assertExists("#payments #balance", "Balance specification is present on account page");
        this.click("#payments a[href='/payments']");
    }).waitForUrl(/payments$/, function () {
        test.assertExists("#cost", "Cost specification is present on payment page");
        test.assertExists("#paid", "Paid specification is present on payment page");
        test.assertExists("#balance", "Balance specification is present on payment page");
        test.assertExists("form[action='https://www.paypal.com/cgi-bin/webscr']", "Paypal form exists");
    }).run(function () {
        test.done();
    });
});
