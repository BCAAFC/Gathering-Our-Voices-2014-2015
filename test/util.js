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
    garbage: function () {
        return Math.random().toString(36).slice(2);
    }
};
