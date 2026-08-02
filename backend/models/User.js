const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, required: true },
    address: { street: String, city: String, postalCode: String, country: String },
}, { timestamps: true });

module.exports = mongoose.model('Users', usersSchema);