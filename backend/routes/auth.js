const express = require('express');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET


// Route 1
// Creating a user using POST : api/auth/signup : No login required
router.post('/signup', [
    body('name', 'name is not valid').isLength({ min: 3 }),
    body('email', 'email is not valid').isEmail(),
    body('password', 'password must be atleast 5 characters').isLength({ min: 5 }),
    body('phone', 'phone number is not valid').isLength({ min: 10 }),
    body('address', 'address is not valid').isLength({ min: 3 }),

], async (req, res) => {
    let success = false;

    // If there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("getting")
        return res.status(400).json({ errors: result.array() });
    }
    try {
        //Check wheather the user with the this email exist already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "sorry a user with this email exist already" })
        }

        let existingPhone = await User.findOne({ phone: req.body.phone });
        if (existingPhone) {
            return res.status(400).json({ success, error: "sorry a user with this phone number already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt)
        //Creates a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
            role: req.body.role,
            phone: req.body.phone,
            address: req.body.address,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true;

        //Send the user as responese if created successully
        res.json({ success, authtoken })

        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})







module.exports = router;