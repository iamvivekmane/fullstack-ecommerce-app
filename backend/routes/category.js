const express = require('express');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');


// Create a new category 
router.post('/', [
    body('name', 'name is not valid').isLength({ min: 3 }),
    body('slug', 'slug is not valid').isLength(3),
    body('parent_category_id', 'parent category do not exist').isLength(3),
    body('image', 'images is not valid').isLength(3),
], async (req, res) => {
    let success = false;

    // If there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {

        let category = await Category.findOne({ name: req.body.name })
        let slug = await Category.findOne({ slug: req.body.slug });

        //Check wheather the name already exists
        if (category) {
            return res.status(400).json({ success, error: "sorry this name exist already" })
        }
        //Check wheather the slug already exists
        else if (slug) {
            return res.status(400).json({ success, error: "sorry this slug exist already" })
        }

        //Creates a new category in database
        category = await Category.create({ name: req.body.name, slug: req.body.slug, parent_category_id: req.body.parent_category_id, image: req.body.image });
        success = true;

        //Send the status and inserted data as responese if created successully
        res.json({ success, category })

        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Get all the categories
router.get('/', [
], async (req, res) => {
    let success = false;

    // If there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        // Get all the categories
        category = await Category.find();
        success = true;

        //Send the data
        res.json({ category })

        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Get category with the id
router.get('/:id', [
], async (req, res) => {

    // If there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        let id = req.params.id;

        // Get category with the id
        let category = await Category.findById(id);

        //Send the data
        res.json({ category })

        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Update category with the id
router.put('/:id', [
    body('name', 'name is not valid').isLength({ min: 3 }),
    body('slug', 'slug is not valid').isLength(3),
    body('parent_category_id', 'parent category do not exist').isLength(3),
    body('image', 'images is not valid').isLength(3),
], async (req, res) => {
    console.log("Executing");

    // If there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {

        let id = req.params.id;
        console.log(req.body);
        let name = await Category.findOne({ name: req.body.name })
        let slug = await Category.findOne({ slug: req.body.slug });
        console.log(id);

        //Check wheather the name already exists
        if (name) {
            return res.status(400).json({ success, error: "sorry this name exist already" })
        }
        //Check wheather the slug already exists
        else if (slug) {
            return res.status(400).json({ success, error: "sorry this slug exist already" })
        }
        // Get category with the id
        let category = await Category.updateOne({ _id: id }, { $set: { name: req.body.name, slug: req.body.slug, parent_category_id: req.body.parent_category_id, image: req.body.image } });

        //Send the data
        res.json({ category })
        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

// Delete category with the id
router.delete('/:id', [
], async (req, res) => {
    // If there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        let success = false;
        let id = req.params.id;
        // Get category with the id
        let category = await Category.findByIdAndDelete(id)
        success = true;
        //Send the data
        res.json({ success, category })
        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

module.exports = router;