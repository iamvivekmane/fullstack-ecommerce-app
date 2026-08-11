const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const fetchuser = require('../middleware/fetchuser')


// Route 1
// Creating a user using POST : api/auth/signup : No login required
router.post('/', [
    body('user', 'User ID must be a valid MongoDB ID').isMongoId(),
    body('items', 'Items array is required').isArray({ min: 1 }),
    body('items.*.product', 'Product ID must be a valid MongoDB ID').isMongoId(),
    body('items.*.quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
    body('items.*.price', 'Price must be a positive number').isFloat({ min: 0 }),
], async (req, res) => {
    let success = false;

    // If there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        //Creates a new cart
        let cart = await Cart.create({
            user: req.body.user,
            items: req.body.items
        });

        success = true;

        //Send the user as responese if created successully
        res.json({ success, cart })

        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})


module.exports = router;