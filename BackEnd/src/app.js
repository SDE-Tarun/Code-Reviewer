const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')

const app = express()

app.use(cors({
    origin: "https://code-reviewer-frontend-kqjn.onrender.com", // Allow frontend URL
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
  }));

app.use(cors())


app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/ai', aiRoutes)

module.exports = app