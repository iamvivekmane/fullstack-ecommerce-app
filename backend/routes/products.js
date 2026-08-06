const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const router = express.Router()
const { body, validationResult } = require('express-validator')


// Creates a new product
router.post('/createproduct', [
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
        console.log("getting")
        return res.status(400).json({ errors: result.array() });
    }
    try {

        //Check wheather the slug already exists
        let product = await Product.findOne({ slug: req.body.slug });
        if (product) {
            return res.status(400).json({ success, error: "sorry this slug exist already" })
        }

        //Creates a new product
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
        console.log(req.body)
        const slug = product.slug;
        success = true;

        //Send the user as responese if created successully
        res.json({ success, slug })

        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})


// Returns list of all the products 
router.get('/getproducts', [
], async (req, res) => {
    let success = false;

    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("getting")
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


// Returns the product with the id
router.get('/getproducts/:id', [
], async (req, res) => {
    let success = false;

    let id = req.params.id;
    console.log(id);
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("getting")
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


// Updates the product with the id
router.put('/updateproduct/:id', [
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

    console.log(id);
    console.log(req.body);
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("getting")
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







module.exports = router;