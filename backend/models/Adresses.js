const mongoose = require('mongoose')

const addressesSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'User' },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    is_default: { type: boolean }
})

module.exports = mongoose.model("Adresses", addressesSchema)