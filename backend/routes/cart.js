const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const isUser = require('../middleware/isUser')


// Route 1: Add items to the cart
router.post('/', [
    body('user', 'User ID must be a valid MongoDB ID').isMongoId(),
    body('items', 'Items array is required').isArray({ min: 1 }),
    body('items.*.product', 'Product ID must be a valid MongoDB ID').isMongoId(),
    body('items.*.quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
    body('items.*.price', 'Price must be a positive number').isFloat({ min: 0 }),
], async (req, res) => {
    let success = false;

    // Validate request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        // Create a new cart with provided data
        let cart = await Cart.create({
            user: req.body.user,
            items: req.body.items
        });

        success = true;

        // Return cart if created successfully
        res.json({ success, cart })

        // Catch and handle errors
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Route 2: Get all items from the cart
router.get('/', [
], async (req, res) => {
    let success = false;

    // Validate request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        // Fetch all carts from database
        let cart = await Cart.find({});

        success = true;

        // Return carts if fetched successfully
        res.json({ success, cart })

        // Catch and handle errors
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Route 3: Update item quantity in the cart
router.put('/:productid', [
    body('quantity', 'Quantity must be a positive number').isInt({ min: 1 })
], async (req, res) => {
    let success = false;
    let id = req.params.productid;

    // Validate request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        // Update the quantity for the specified product in cart
        let cart = await Cart.updateOne({ "items.product": id }, { $set: { "items.$.quantity": req.body.quantity } }, { new: true });
        console.log(id);

        success = true;

        // Return updated cart if successful
        res.json({ success, cart })

        // Catch and handle errors
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Route 4: Remove product from the cart
router.delete('/:productid', [
], async (req, res) => {
    let success = false;
    let id = req.params.productid;

    // Validate request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        // Remove the specified product from cart
        let cart = await Cart.updateOne({ "items.product": id }, { $pull: { items: { product: id } } })

        success = true;

        // Return result if deletion successful
        res.json({ success, cart })

        // Catch and handle errors
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Route 5: Clear entire cart
router.delete('/', [
], async (req, res) => {
    let success = false;

    // Validate request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        // Delete entire cart from database
        let cart = await Cart.deleteOne()
        success = true;

        // Return result if deletion successful
        res.json({ success, cart })

        // Catch and handle errors
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})


module.exports = router;