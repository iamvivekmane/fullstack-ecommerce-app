const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    parent_category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);