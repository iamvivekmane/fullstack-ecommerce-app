const express = require('express');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const fetchuser = require('../middleware/fetchuser');

// Route 1
// Creating a user using POST : api/auth/signup 
router.post('/signup', [
    body('name', 'name is not valid').isLength({ min: 3 }),
    body('email', 'email is not valid').isEmail(),
    body('password', 'password must be atleast 5 characters').isLength({ min: 5 }),
    body('phone', 'phone number is not valid').isMobilePhone(['en-IN']),
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
        const createdUser = await User.findById(user.id);
        const authtoken = jwt.sign(data, JWT_SECRET)
        const role = createdUser.role;
        success = true;

        //Send the user as responese if created successully
        res.json({ success, authtoken, role })

        //Catches the error
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})


// Route 2
// Authenticate a user using POST : api/auth/login : No login required
router.post('/login', [
    body('email', 'email is not valid').isEmail(),
    body('password', 'password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    // If there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("Thiks is getting called")
        return res.status(400).json({ errors: result.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: 'Login with correct credentials' })
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ success, error: 'Login with correct credentials' })
        }

        const data = {
            user: {
                id: user.id
            }
        }


        const createdUser = await User.findById(user.id);
        const authtoken = jwt.sign(data, JWT_SECRET)
        const role = createdUser.role;
        success = true;

        //Send the user as responese if created successully
        res.json({ success, authtoken, role })


    } catch (error) {
        console.log("this issue")
        res.status(500).send("Internal server error");
    }
})

// Route 3
// Get loggedin user details using POST : api/auth/getuser : login required
router.get('/getuser', fetchuser, async (req, res) => {
    try {
        let success = false;
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        success = true;
        res.json({ success, user })
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})


module.exports = router;