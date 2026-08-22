const express = require('express');
const Product = require('../models/Product');
const router = express.Router()
const { body, param, validationResult } = require('express-validator')
const isAdmin = require('../middleware/isAdmin')

// Route 1
// Create a new product using POST : api/products/
// Admin login required
router.post('/', isAdmin, [
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

// Route 2
// Get all the featured products using GET : api/products/featured
// No login required
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

// Route 3
// Get all the  products using GET : api/products/
// No login required
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


// Route 4
// Get all the featured products using GET : api/products/:id
// No login required
router.get('/:id', [
    param('id', 'id is not valid').isMongoId()
], async (req, res) => {
    let success = false;
    let id = req.params.id;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        let products = await Product.findById({ _id: id });
        success = true;
        res.json({ products })
        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Route 5
// Update the product with the id using PUT : api/products/:id
// Admin login required
router.put('/:id', isAdmin, [
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
    param('id', 'id is not valid').isMongoId()
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

// Route 6
// Delete the product with the id using DELETE : api/products/:id
// Admin login required
router.delete('/:id', isAdmin, [
    param('id', 'id is not valid').isMongoId()
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