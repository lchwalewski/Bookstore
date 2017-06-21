var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: {
        type: Object,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['inprogress', 'done', 'canceled'],
        default: 'inprogress'
    },
}, {
    timestamps: { createdAt: 'create_date', updatedAt: 'update_date' }
});

module.exports = mongoose.model('Order', schema);