const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const isAdmin = (req, res, next) => {
    //Get user from JWT token and add id to the request object
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        req.role = data.user.role;
        if (req.role != 'admin') {
            return res.status(401).send({ error: "Please authenticate admin token" })
        }
        next();
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}
module.exports = isAdmin;