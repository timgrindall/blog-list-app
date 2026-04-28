const express = require('express')
const app = express()

app.use(express.json())

const blogsRouter = require('./controllers/blogs')

app.use('/api/blogs', blogsRouter)

module.exports = app