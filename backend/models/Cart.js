const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true, unique: true },
    items: [{ product: { type: mongoose.Schema.ObjectId, ref: 'Product' }, quantity: { type: Number, default: 1 }, price: { type: Number, required: true } }]
}, { timestamps: true })

module.exports = new mongoose.model("Cart", cartSchema)