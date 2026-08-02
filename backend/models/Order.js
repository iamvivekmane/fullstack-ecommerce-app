const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { Type: Number, required: true, default: 1 }
    }],
    shippingAddress: { street: { type: String }, city: { type: String }, state: { type: String }, zip: { type: String }, country: { type: String }, },
    paymentMethod: { type: String, default: 'razorpay' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
    totalAmount: { type: Number, required: true }
}, { timestamps: true })


module.exports = mongoose.model("Order", orderSchema);