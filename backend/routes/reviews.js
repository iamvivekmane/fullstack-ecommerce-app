const express = require('express');
const Review = require('../models/Review');
const router = express.Router()
const { body, validationResult } = require('express-validator')


// Create a new review
router.post('/', [
    body('product', 'Product ID must be a valid MongoDB ID').isMongoId(),
    body('user', 'User ID must be a valid MongoDB ID').isMongoId(),
    body('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    body('comment', 'Comment must be at least 3 characters').trim().isLength({ min: 3 }).escape(),
], async (req, res) => {
    let success = false;

    // If there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {


        //Creates a new review in database
        let review = await Review.create({
            product: req.body.product,
            user: req.body.user,
            rating: req.body.rating,
            comment: req.body.comment
        });
        success = true;

        //Send the user as responese if created successully
        res.json({ success, review })

        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Get all the reviews of a product
router.get('/:productid', [
], async (req, res) => {
    let success = false;

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    let productId = req.params.productid;
    try {
        let review = await Review.find({ product: productId });
        success = true;
        res.json({ success, review })
        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})


// Update review with the id
router.put('/:id', [
    body('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    body('comment', 'Comment must be at least 3 characters').trim().isLength({ min: 3 }).escape(),
], async (req, res) => {
    console.log("hello");
    let success = false;

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    let reviewId = req.params.id;
    console.log(reviewId);
    try {
        let review = await Review.updateOne({ _id: reviewId }, { $set: { rating: req.body.rating, comment: req.body.comment } });
        success = true;
        res.json({ success, review })
        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})


// Delete review with the id
router.delete('/:id', [
], async (req, res) => {
    let success = false;

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    let reviewId = req.params.id;
    console.log(reviewId);
    try {
        let review = await Review.deleteOne({ _id: reviewId });
        success = true;
        res.json({ success, review })
        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})


module.exports = router;