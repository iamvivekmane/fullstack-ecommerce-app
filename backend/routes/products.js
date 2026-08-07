const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const router = express.Router()
const { body, validationResult } = require('express-validator')


// Create a new product
router.post('/', [
    body('name', 'name is not valid').isLength({ min: 3 }),
    body('slug', 'slug is not valid').isLength(3),
    body('description', 'description is not valid').isLength(3),
    body('price', 'price is not valid').isLength(1),
    body('discountPrice', 'price is not valid').isLength(1),
    body('brand', 'brand is not valid').isLength(1),
    body('stock', 'stock is not valid').isLength(1),
    body('images', 'images is not valid').isLength(3),
    body('isFeatured', 'images is not valid').isBoolean(),
    body('ratings', 'ratings is not valid').isLength(3),
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
    body('name', 'name is not valid').isLength({ min: 3 }),
    body('slug', 'slug is not valid').isLength(3),
    body('description', 'description is not valid').isLength(3),
    body('price', 'price is not valid').isLength(1),
    body('discountPrice', 'price is not valid').isLength(1),
    body('brand', 'brand is not valid').isLength(1),
    body('stock', 'stock is not valid').isLength(1),
    body('images', 'images is not valid').isLength(3),
    body('isFeatured', 'images is not valid').isBoolean(),
    body('ratings', 'ratings is not valid').isLength(3),
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


// Get all the products
router.get('/featured', [
], async (req, res) => {
    console.log("hello");
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


module.exports = router;