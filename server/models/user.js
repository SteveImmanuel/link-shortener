const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    alias: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    routes: [{ type: Schema.Types.ObjectId, ref: 'Route' }]
})

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;