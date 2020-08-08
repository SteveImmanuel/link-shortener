const mongoose = require('mongoose');
const RouteSchema = mongoose.Schema({
    url: { type: String, trim: true, required: true },
    slug: { type: String, trim: true, required: true }
})

const RouteModel = mongoose.model('Route', RouteSchema);
module.exports = RouteModel;