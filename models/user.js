var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var validate = require('mongoose-validator');

var Schema = mongoose.Schema;
// VALIDATORS //
/////////////////////////////
var firstNameValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 20],
        message: 'Imię powinno zawierać od {ARGS[0]} do {ARGS[1]} liter.'
    })
];
var lastNameValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 50],
        message: 'Nazwisko powinno zawierać od {ARGS[0]} do {ARGS[1]} liter.'
    })
];
var passwordValidator = [
    validate({
        validator: 'isLength',
        arguments: [4, 50],
        message: 'Hasło powinno zawierać conajmniej {ARGS[0]} znaków.'
    })
];
var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Nie poprawny adres e-mail'
    })
];
var cityValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 40],
        message: 'Miasto powinno zawierać od {ARGS[0]} do {ARGS[1]} liter.'
    })
];
var streetValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 40],
        message: 'Ulica powinna zawierać od {ARGS[0]} do {ARGS[1]} znaków.'
    })
];
var buildingValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 4],
        message: 'Numer budynku powinnien zawierać od {ARGS[0]} do {ARGS[1]} znaków.'
    })
];
var flatValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 4],
        passIfEmpty: true,
        message: 'Numer mieszkania powinnien zawierać od {ARGS[0]} do {ARGS[1]} znaków.'
    })
];
/////////////////////////////
var userSchema = new Schema({
    firstName: {
        type: String,
        validate: firstNameValidator,
        required: true
    },
    lastName: {
        type: String,
        validate: lastNameValidator,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: emailValidator,
        required: true
    },
    street: {
        type: String,
        validate: streetValidator,
        required: true
    },
    city: {
        type: String,
        validate: cityValidator,
        required: true
    },
    buildingNumber: {
        type: String,
        validate: buildingValidator,
        required: true
    },
    flatNumber: {
        type: String,
        validate: flatValidator,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client',
        required: true
    },
}, {
    timestamps: { createdAt: 'create_date', updatedAt: 'update_date' }
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);