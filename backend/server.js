const express = require('express');
const app = express()
const connectDB = require('./config/db')
require('dotenv').config();

app.use(express.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/category', require('./routes/category'))
app.use('/api/reviews', require('./routes/reviews'))
app.use('/api/cart', require('./routes/cart'))
connectDB()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`Ecommerce app listening on port ${PORT}`)
})