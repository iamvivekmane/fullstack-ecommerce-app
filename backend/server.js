const express = require('express');
const app = express()
const connectDB = require('./config/db')
require('dotenv').config();

connectDB()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Ecommerce app listening on port ${PORT}`)
})