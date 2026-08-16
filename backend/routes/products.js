const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const router = express.Router()
const { body, validationResult } = require('express-validator')


// Create a new product
router.post('/', [
    body('name', 'name must be at least 3 characters').isLength({ min: 3 }),
    body('slug', 'slug must be at least 3 characters').isLength({ min: 3 }),
    body('description', 'description must be at least 3 characters').isLength({ min: 3 }),
    body('price', 'price must be a positive number').isFloat({ min: 0 }),
    body('discountPrice', 'discount price must be a positive number').isFloat({ min: 0 }),
    body('category', 'category must be a valid ID').isMongoId(),
    body('brand', 'brand must be at least 2 characters').isLength({ min: 2 }),
    body('stock', 'stock must be a non-negative integer').isInt({ min: 0 }),
    body('images', 'images must be an array with at least one image').isArray({ min: 1 }),
    body('isFeatured', 'isFeatured must be true or false').isBoolean(),
], async (req, res) => {
    let success = false;

    // If there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {

        //Check wheather the slug already exists
        let product = await Product.findOne({ slug: req.body.slug });
        if (product) {
            return res.status(400).json({ success, error: "sorry this slug exist already" })
        }

        //Creates a new product in database
        product = await Product.create({
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            discountPrice: req.body.discountPrice,
            category: req.body.category,
            brand: req.body.brand,
            stock: req.body.stock,
            images: req.body.images,
            isFeatured: req.body.isFeatured,
            ratings: req.body.ratings,
        });
        const slug = product.slug;
        success = true;

        //Send the user as responese if created successully
        res.json({ success, slug })

        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})
// Get all the featured products
router.get('/featured', [
], async (req, res) => {
    let success = false;

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        let products = await Product.find({ isFeatured: true });
        success = true;
        res.json({ products })
        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Get all the products
router.get('/', [
], async (req, res) => {
    let success = false;

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        let products = await Product.find();
        success = true;
        res.json({ products })
        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})


// Get the product with the id
router.get('/:id', [
], async (req, res) => {
    let success = false;
    let id = req.params.id;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        let products = await Product.find({ _id: id });
        success = true;
        res.json({ products })
        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Update the product with the id
router.put('/:id', [
    body('name', 'name must be at least 3 characters').isLength({ min: 3 }),
    body('slug', 'slug must be at least 3 characters').isLength({ min: 3 }),
    body('description', 'description must be at least 3 characters').isLength({ min: 3 }),
    body('price', 'price must be a positive number').isFloat({ min: 0 }),
    body('discountPrice', 'discount price must be a positive number').isFloat({ min: 0 }),
    body('category', 'category must be a valid ID').isMongoId(),
    body('brand', 'brand must be at least 2 characters').isLength({ min: 2 }),
    body('stock', 'stock must be a non-negative integer').isInt({ min: 0 }),
    body('images', 'images must be an array with at least one image').isArray({ min: 1 }),
    body('isFeatured', 'isFeatured must be true or false').isBoolean(),
], async (req, res) => {
    let success = false;
    let id = req.params.id;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        let product = await Product.updateOne({ _id: id }, {
            $set: {
                name: req.body.name,
                slug: req.body.slug,
                description: req.body.description,
                price: req.body.price,
                discountPrice: req.body.discountPrice,
                category: req.body.category,
                brand: req.body.brand,
                stock: req.body.stock,
                images: req.body.images,
                isFeatured: req.body.isFeatured,
                ratings: req.body.ratings
            }
        });
        success = true;
        res.json({ product })
        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Delete the product with the id
router.delete('/:id', [
], async (req, res) => {
    let success = false;
    let id = req.params.id;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        let product = await Product.deleteOne({ _id: id });
        success = true;
        res.json({ product })
        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})





module.exports = router;