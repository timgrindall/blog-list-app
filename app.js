const express = require('express')
const app = express()

const notesRouter = require('./controllers/blogs')
app.use('/api/notes', notesRouter)

module.exports = app