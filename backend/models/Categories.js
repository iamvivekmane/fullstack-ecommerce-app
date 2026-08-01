const mongoose = require('mongoose')

const categoriesSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    parent_category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: { type: varchar, required: true }
})

module.exports = mongoose.model('Categories', categoriesSchema);