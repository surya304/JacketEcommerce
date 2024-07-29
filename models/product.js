

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: [String],
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category
    review: { type: Number, required: true },
    is_del: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

let Product = mongoose.model('Product', productSchema);
module.exports = Product;
