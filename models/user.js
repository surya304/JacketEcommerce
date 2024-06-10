let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//MongoDB schemas
let Schema = mongoose.Schema;

// create a schema
let userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verification: { type: Boolean, default: true },
    verification_key: { type: String, required: true },
    is_del: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    created_at: Date,
    updated_at: Date
});


let User = mongoose.model('User', userSchema);

module.exports = User;