

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//MongoDB schemas
let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: [String],

    review: { type: Number, required: true },
    is_del: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    created_at: Date,
    updated_at: Date
});

export default mongoose.model('Product', productSchema);