require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const db = require('./db')

const port = process.env.PORT || 6969
const app = express()

app.use(morgan('dev'))
app.use(express.json())

// Get All Restaurants
app.get('/api/v1/restaurants', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM restaurants')

        res.status(200).json({
            results: results.rowCount,
            data: {
                restaurants: results.rows
            },
            status: 'success'
        })
    } catch (error) {
        console.log(error)
    }
})

// Get One Restaurant
app.get('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM restaurants WHERE id = $1', [req.params.id])

        res.status(200).json({
            data: {
                restaurant: results.rows[0],
            },
            message: 'success'
        })
    } catch (error) {
        console.log(error)
    }
})

// Create a Restaurant
app.post('/api/v1/restaurants', async (req, res) => {
    try {
        const results = await db.query('INSERT INTO restaurants (name, location, price_range) values($1, $2, $3) RETURNING *',
            [req.body.name, req.body.location, req.body.price_range]
        )
        res.status(201).json({
            data: {
                restaurant: results.rows[0],
            },
            message: 'success'
        })
    } catch (error) {
        console.log(error)
    }
})

// Update Restaurants
app.put('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const results = await db.query('UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 RETURNING *',
            [req.body.name, req.body.location, req.body.price_range, req.params.id]
        )
        res.status(200).json({
            data: {
                restaurant: results.rows[0],
            },
            message: 'success'
        })
    } catch (error) {
        console.log(error)
    }
})

app.delete('/api/v1/restaurants/:id', async (req, res) => {
    try {
        const results = await db.query('DELETE FROM restaurants WHERE id = $1', [req.params.id])
        res.status(204).json({
            message: 'success'
        })
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => console.log(`listening on localhost:${port}`))
