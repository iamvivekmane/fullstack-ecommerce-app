const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
    brand: { type: String, required: true, },
    stock: { type: Number, required: true, },
    images: [{ type: String }],
    isFeatured: { type: Boolean, required: true },
    ratings: { average: { type: Number, default: 0, min: 0, max: 5 }, count: { type: Number, default: 0, min: 0 } }
}, { timestamps: true })

Module.exports = mongoose.model("Product", productSchema);