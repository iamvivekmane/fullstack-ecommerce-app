const express = require('express');
const Order = require('../models/Order');
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const fetchuser = require('../middleware/fetchuser')


// Route 1: Add items to the cart
router.post('/', [
    body('user', 'User ID must be a valid MongoDB ID').isMongoId(),
    body('items', 'Items array is required').isArray({ min: 1 }),
    body('items.*.product', 'Product ID must be a valid MongoDB ID').isMongoId(),
    body('items.*.quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
    body('items.*.price', 'Price must be a positive number').isFloat({ min: 0 }),
    body('shippingAddress.street', 'Street must be valid').isString({ min: 5 }),
    body('shippingAddress.city', 'City must be valid').isString({ min: 5 }),
    body('shippingAddress.zip', 'Zip must be valid').isString({ min: 5 }),
    body('shippingAddress.country', 'Country must be valid').isString({ min: 5 }),
    body('paymentMethod', 'Payment method must be valid').isString({ min: 2 }),
    body('paymentStatus', 'Payment status must be valid').isIn(['pending', 'paid', 'failed']),
    body('orderStatus', 'Order status must be valid').isIn(['placed', 'processing', 'shipped', 'delivered', 'cancelled']),
    body('totalAmount', 'Order amount must be valid').isInt({ min: 0 }),

], async (req, res) => {
    let success = false;
    console.log(req.body.user);
    // Validate request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        // Create a new cart with provided data
        let order = await Order.create({
            user: req.body.user,
            items: req.body.items,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            paymentStatus: req.body.paymentStatus,
            orderStatus: req.body.orderStatus,
            totalAmount: req.body.totalAmount
        });
        console.log("helo");
        success = true;

        // Return cart if created successfully
        res.json({ success, order })
        // Catch and handle errors
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})




module.exports = router;