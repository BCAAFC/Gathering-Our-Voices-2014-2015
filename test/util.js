module.exports = {
    group: {
        email: 'test@test.ca',
        password: 'test',
        passwordConfirm: 'test',
        name: 'test name',
        affiliation: 'test affilication',
        address: 'test address',
        city: 'test city',
        region: 'Out of Province',
        province: 'Other (Outside Canada)',
        postalCode: 'A1B 2C3',
        phone: '(123) 456-7890',
        affiliationType: 'Other'
    },
    memberCount: 0,
    member: function (type, year) {
        this.memberCount += 1;
        return {
            name: 'Member-' + this.memberCount,
            type: type,
            gender: 'Female',
            phone: 'Phone-' + this.memberCount,
            birthDay: 1,
            birthMonth: 'January',
            birthYear: year,
            emergMedicalNum: 'EmergMedicalNum-' + this.memberCount,
            emergAllergies: 'EmergAllergies-' + this.memberCount,
            emergConditions: 'EmergConditions-' + this.memberCount,
            emergName: 'EmergName-' + this.memberCount,
            emergRelation: 'EmergRelationship-' + this.memberCount,
            emergPhone: 'EmergPhone-' + this.memberCount
        };
    },
    garbage: function () {
        return Math.random().toString(36).slice(2);
    }
};
