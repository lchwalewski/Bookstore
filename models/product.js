var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var Schema = mongoose.Schema;
// VALIDATORS //
/////////////////////////////

var isbnValidator = [
    validate({
        validator: 'isISBN',
        message: 'Numer ISBN musi zawierać 10 lub 13 cyfr.'
    })
];

/////////////////////////////
var productSchema = new Schema({
    //Link (WWWW) to book thumbnail
    image: {
        type: String,
        required: false
    },
    //Book title
    title: {
        type: String,
        required: true
    },
    //Book author
    author: {
        type: String,
        required: true
    },
    //max 1000 digits description
    description: {
        type: String
    },
    //Name of company who published book
    publisher: {
        type: String,
        required: true
    },
    //Year when book was published
    year: {
        type: Number,
        required: true
    },
    // Book price in PLN
    price: {
        type: Number,
        required: true
    },
    //Book genre
    genre: {
        type: String,
        enum: ['action', 'drama', 'cooking', 'education', 'sf', 'kids'],
        required: true
    },
    //ISBN 10/13 number
    isbn: {
        type: String,
        validate: isbnValidator,
        unique: true,
        required: true
    },
    promo: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: { createdAt: 'create_date', updatedAt: 'update_date' }
});

module.exports = mongoose.model('Product', productSchema);