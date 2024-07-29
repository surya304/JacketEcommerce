const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let Schema = mongoose.Schema;
// c

let categorySchema = new Schema({
	name: { type: String, required: true },
	description: { type: String }
});
let Category = mongoose.model('Category', categorySchema);

module.exports = Category;