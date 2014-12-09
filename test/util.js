module.exports = {
    group: {
        email           : 'test@test.ca',
        password        : 'test',
        passwordConfirm : 'test',
        name            : 'test name',
        affiliation     : 'test affilication',
        address         : 'test address',
        city            : 'test city',
        region          : 'Out of Province',
        province        : 'Other (Outside Canada)',
        postalCode      : 'A1B 2C3',
        phone           : '(123) 456-7890',
        affiliationType : 'Other'
    },
    admin: {
        email           : 'andrew@hoverbear.org',
        password        : 'admin',
        passwordConfirm : 'admin',
        name            : 'admin name',
        affiliation     : 'admin affilication',
        address         : 'admin address',
        city            : 'admin city',
        region          : 'Out of Province',
        province        : 'Other (Outside Canada)',
        postalCode      : 'A1B 2C3',
        phone           : '(123) 456-7890',
        affiliationType : 'Other'
    },
    workshop: {
        name: 'Test workshop',
        host: 'Test host',
        description: 'Test description',
        'allows-youth': 'on',
        'allows-youngAdult': 'on',
        'allows-youngChaperone': 'on',
        'allows-chaperone': 'on',
        category: 'Mental',
        tags: 'test1,test2'
    },
    session: {
        start: 'March 20, 2015 9:00 PDT',
        end: 'March 20, 2015 9:00 PDT',
        room: 'Test Room',
        venue: 'Test Venue',
        capacity: 20
    },
    memberCount: 0,
    member: function (type, year) {
        this.memberCount += 1;
        return {
            name            : 'Member-' + this.memberCount,
            type            : type,
            gender          : 'Female',
            phone           : 'Phone-' + this.memberCount,
            birthDay        : 1,
            birthMonth      : 'January',
            birthYear       : year,
            emergMedicalNum : 'EmergMedicalNum-' + this.memberCount,
            emergAllergies  : 'EmergAllergies-' + this.memberCount,
            emergConditions : 'EmergConditions-' + this.memberCount,
            emergName       : 'EmergName-' + this.memberCount,
            emergRelation   : 'EmergRelationship-' + this.memberCount,
            emergPhone      : 'EmergPhone-' + this.memberCount
        };
    },
    garbage: function () {
        return Math.random().toString(36).slice(2);
    }
};
