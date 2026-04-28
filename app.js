const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
// const middleware = require('./utils/middleware')

const app = express()

if (!config.MONGODB_URI) {
  console.log('No MONGO_URI ENV variable!')
  process.exit(1)
}

mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app