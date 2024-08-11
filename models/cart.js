let mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

// MongoDB schemas
let Schema = mongoose.Schema;

let cartSchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('Cart', cartSchema);